import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [index, app, redirect, operation, demo, chatDemo, manifest] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("js/app.js", "utf8"),
  readFile("js/redirect.js", "utf8"),
  readFile("operationinfo.html", "utf8"),
  readFile("demo.html", "utf8"),
  readFile("chat-demo.html", "utf8"),
  readFile("site.webmanifest", "utf8")
]);

test("entry and diagnostic flow preserve the specified copy", () => {
  for (const copy of [
    "経験がある",
    "はじめて",
    "カードローン選びで、最も重視することを教えてください。",
    "いくら借りたいですか？",
    "いつまでに借りたいですか？",
    "どのように借りたいですか？",
    "現在の年齢を教えてください。",
    "現在の職業を教えてください。",
    "現在の年収を教えてください。"
  ]) {
    assert.ok(index.includes(copy) || app.includes(copy), `missing copy: ${copy}`);
  }
});

test("experienced users receive the card-loan history question", () => {
  for (const option of ["アコム", "プロミス", "SMBCモビット", "アイフル", "その他・覚えていない"]) {
    assert.ok(app.includes(`"${option}"`), `missing experience option: ${option}`);
  }
  assert.match(app, /state\.experience === "experience_yes" \? "q00" : "q01"/);
});

test("result order is fixed and Mobit is repeated as the final recommendation", () => {
  const mobit = app.indexOf('key: "mobit"');
  const aiflu = app.indexOf('key: "aiflu"');
  const promise = app.indexOf('key: "promise"');
  assert.ok(mobit > -1 && mobit < aiflu && aiflu < promise);
  assert.match(app, /finalLender\.replaceChildren\(createLenderCard\(lenders\[0\]/);
  assert.match(index, /即日で借りたいなら<br>このカードローン/);
});

test("affiliate redirect identifiers remain mapped to every lender", () => {
  for (const [key, id] of [
    ["acom", "k16c4161"],
    ["promise", "681662bS"],
    ["mobit", "d4541636"],
    ["aiflu", "6146a11d"]
  ]) {
    assert.ok(redirect.includes(`${key}:`), `missing redirect key: ${key}`);
    assert.ok(redirect.includes(id), `missing affiliate id: ${id}`);
  }
});

test("tracking, PR disclosure, notes and operator information remain present", () => {
  assert.ok(index.includes("GTM-TQHV5GQ5"));
  assert.ok(index.includes("PRリンクが含まれています"));
  assert.ok(index.includes("operationinfo.html"));
  assert.ok(operation.includes("moment合同会社"));
  assert.ok(operation.includes("PRリンクが含まれています"));
  assert.ok(app.includes("【PR】Sponsored by"));
});

test("legacy routes forward to the canonical entry and the manifest is valid", () => {
  assert.ok(demo.includes("window.location.replace(destination)"));
  assert.ok(chatDemo.includes("window.location.replace(destination)"));
  assert.doesNotThrow(() => JSON.parse(manifest));
});

test("the runtime loads only the independent application bundle", () => {
  assert.match(index, /css\/app\.css/);
  assert.match(index, /js\/app\.js/);
  for (const stale of ["style_add.css", "jquery", "swiper", "result-cards-v2", "demo-chat-fix"]) {
    assert.ok(!index.toLowerCase().includes(stale), `stale dependency in index: ${stale}`);
  }
});
