import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const runtimeExtensions = new Set([".html", ".css", ".js", ".json", ".md", ".svg", ".webmanifest"]);
const ignoredDirectories = new Set([".git", "audit-evidence", "scripts", "tests"]);
const expectedOrigins = new Set([
  "http://www.w3.org",
  "https://ac.rextjapan-finance.com",
  "https://admin2-a11y.github.io",
  "https://www.googletagmanager.com"
]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    if (entry.isFile()) files.push(absolute);
  }
  return files;
}

function relative(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function localReference(fromFile, reference) {
  const clean = reference.split(/[?#]/, 1)[0].trim();
  if (clean.includes("${")) return null;
  if (!clean || clean === "." || clean === "./" || clean.startsWith("#")) return null;
  if (/^(?:https?:|data:|mailto:|tel:|javascript:|\/\/)/i.test(clean)) return null;
  const base = path.extname(fromFile).toLowerCase() === ".js" ? root : path.dirname(fromFile);
  return path.resolve(base, decodeURIComponent(clean));
}

const files = await walk(root);
const runtimeFiles = files.filter((file) => runtimeExtensions.has(path.extname(file).toLowerCase()));
const textByFile = new Map();
for (const file of runtimeFiles) textByFile.set(file, await readFile(file, "utf8"));

const externalOrigins = new Set();
const brokenReferences = [];
for (const [file, text] of textByFile) {
  for (const match of text.matchAll(/https?:\/\/[^\s"'<>`)]+/g)) {
    try {
      externalOrigins.add(new URL(match[0]).origin);
    } catch {
      brokenReferences.push(`${relative(file)}: malformed URL ${match[0]}`);
    }
  }

  const references = [...text.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)];
  if (path.extname(file).toLowerCase() === ".css") {
    references.push(...text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi));
  }
  for (const match of references) {
    const target = localReference(file, match[1]);
    if (!target) continue;
    try {
      await access(target);
    } catch {
      brokenReferences.push(`${relative(file)} -> ${match[1]}`);
    }
  }
}

const unexpectedOrigins = [...externalOrigins].filter((origin) => !expectedOrigins.has(origin));
const imageDirectory = path.join(root, "images");
const images = (await readdir(imageDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name);
const runtimeText = [...textByFile.values()].join("\n");
const unusedImages = images.filter((image) => !runtimeText.includes(image));
const sourceMaps = files.filter((file) => file.endsWith(".map")).map(relative);
const obsoleteDirectories = ["assets", "fonts", "vendor"].filter((name) => files.some((file) => relative(file).startsWith(`${name}/`)));

const failures = [];
if (unexpectedOrigins.length) failures.push(`Unexpected external origins: ${unexpectedOrigins.join(", ")}`);
if (brokenReferences.length) failures.push(`Broken local references:\n- ${brokenReferences.join("\n- ")}`);
if (unusedImages.length) failures.push(`Unused images: ${unusedImages.join(", ")}`);
if (sourceMaps.length) failures.push(`Source maps are publicly present: ${sourceMaps.join(", ")}`);
if (obsoleteDirectories.length) failures.push(`Obsolete runtime directories remain: ${obsoleteDirectories.join(", ")}`);

console.log(JSON.stringify({
  runtimeFiles: runtimeFiles.length,
  images: images.length,
  externalOrigins: [...externalOrigins].sort(),
  brokenReferences: brokenReferences.length,
  unusedImages: unusedImages.length,
  sourceMaps: sourceMaps.length
}, null, 2));

if (failures.length) {
  console.error(`\nStatic site audit failed:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("\nStatic site audit passed.");
}
