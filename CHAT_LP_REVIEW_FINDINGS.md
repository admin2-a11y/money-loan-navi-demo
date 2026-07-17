# Final Status

CONDITIONAL PASS

The runtime implementation, responsive behavior and three technical re-audits pass. The result is conditional because an approved brand/domain/asset allowlist was not supplied, retained image rights cannot be established from code, and GTM loads downstream providers that require owner or contract confirmation. This is a technical audit and is not a legal non-infringement opinion.

# Scope

- `/`
- `/demo.html`
- `/chat-demo.html`
- `/operationinfo.html`
- `/redirect.html?item=acom|promise|mobit|aiflu`
- HTML, CSS, JavaScript, images, SVG, favicon, manifest, public Markdown, tests and audit scripts
- Baseline commit: `6125abf`

# Major Findings Before Changes

| Severity | Type | Baseline location | Evidence | Resolution |
| --- | --- | --- | --- | --- |
| Critical | Old brand asset | `images/mordalhead.png` | Unused image contained an old brand and design-tool identifiers. | Deleted from the public repository. |
| Critical | Old favicon | `images/icon.png`; legacy HTML head | Old visual identity was still referenced by favicon markup. | Deleted and replaced with original `favicon.svg`. |
| High | Public implementation history | Previous review Markdown | Public files named reference projects, local paths and import history. | Replaced with anonymized, evidence-based reports. |
| High | Unrelated executable code | `assets/js/script.js:721` onward | A separate housing questionnaire and server-template remnants were bundled. | Removed the whole unused legacy runtime. |
| High | Unverified custom image set | former hero, modal and independent claim images | Multiple unused or provenance-unclear images remained in public assets. | Removed rather than renamed or metadata-stripped. |
| Medium | Third-party libraries | legacy HTML/CSS/JS | jQuery, slider, animation, icon-font and WordPress remnants were present without current use. | Removed; current runtime has no package dependency. |
| Medium | Broken/duplicate assets | legacy CSS and images | Baseline static scan found broken references, duplicate logos and unused files. | Consolidated to 15 audited runtime/public text files and 10 used images; zero broken references. |
| Medium | Reference-like UI system | former first view, chat and cards | Image-led first view, social-message styling, cloud background and stacked accent cards formed a broad visual system. | Rebuilt layout, tokens, components and responsive behavior independently. |

# Implemented Changes

- `index.html`: clean semantic entry, diagnosis and results shell; required metadata and GTM retained.
- `css/app.css`: new color, spacing, typography, radius, border, shadow, form, card, breakpoint, focus and motion rules.
- `js/app.js`: preserved questions and answers, experienced-only branch, correction, analysis state, fixed ranking and final recommendation.
- `operationinfo.html`: removed unused external UI libraries while retaining operator details, PR disclosure and notes.
- `redirect.html`, `js/redirect.js`: retained affiliate mapping and tracking parameters without former UI libraries.
- `demo.html`, `chat-demo.html`: lightweight aliases that retain query and hash values.
- `favicon.svg`, `site.webmanifest`: new project-owned browser identity layer.
- `package.json`, `scripts/site-audit.mjs`, `tests/site.test.mjs`: dependency-free static validation and regression checks.

# Removed or Replaced Assets

| Old group | Replacement/use | Reason |
| --- | --- | --- |
| `assets/css/`, legacy root CSS and copied library CSS | `css/app.css` | Independent design system; no unused vendor CSS. |
| `assets/js/`, legacy root JS and copied libraries | `js/app.js`, `js/redirect.js` | Independent behavior; unrelated and dead code removed. |
| Former old-brand favicon and hero/modal assets | `favicon.svg`, semantic HTML/CSS entry, retained approved advisor image | Old identity and provenance-unclear assets removed. |
| Duplicate logos, crowns, rank art, loading art and unused claim images | CSS text and standard components | Removed unused or source-unclear visuals instead of disguising them. |
| Former social background and image-led first view | Neutral canvas and structured entry choices | Independent composition and responsive behavior. |

Retained product banners and review images were not edited or replaced, in accordance with the owner's constraint.

# External Communication

## Direct Source Before

The baseline directly referenced GTM, the affiliate redirect service, external JavaScript/CDN libraries, an icon-font service and WordPress resources.

## Direct Source After

- `admin2-a11y.github.io`: canonical and Open Graph URLs
- `www.googletagmanager.com`: required GTM container
- `ac.rextjapan-finance.com`: required affiliate handoff URLs
- `www.w3.org`: SVG namespace only; not a network dependency

## Runtime DOM Injected by GTM

Observed after the final change:

- `www.googletagmanager.com`
- `analytics.tiktok.com`
- `connect.facebook.net`
- `static.ads-twitter.com`
- `analytics.twitter.com`
- `t.co`
- `tag.eisa.mercari.com`
- `googleads.g.doubleclick.net`
- `ac.admanager-adops.com`
- `d.line-cdn.net`

These are not imported by application code; they are created by the retained GTM configuration. Because no approved-domain list was provided, they remain an explicit owner-confirmation item. Two injected resources were observed with `http://` URLs and should be reviewed in GTM for secure equivalents.

# Validation Results

| Check | Result |
| --- | --- |
| Static build/audit | PASS: 15 runtime/public text files, 10 images, 0 broken references, 0 unused images, 0 source maps |
| JavaScript syntax | PASS: `js/app.js`, `js/redirect.js` |
| Unit/regression tests | PASS: 7/7 |
| Whitespace/conflict scan | PASS |
| Type check | Not applicable: no TypeScript |
| Dedicated integration test | Not present |
| Browser E2E | PASS: completed manually in the in-app browser |

`npm` is not installed in the workspace shell. The package scripts' underlying Node commands were run directly. An initial `pnpm` attempt was affected by its own registry metadata check; no dependency installation is needed by this project.

# Browser Check

- Widths: 320, 375, 390, 414, 768, 1280 and 1440px
- Horizontal overflow: none at all checked widths
- Entry buttons: both routes start correctly
- Experienced route: multiple choice appears; next is disabled until selection
- Beginner route: skips the experience-details question
- Correction: prior answer can be reopened and later turns are rebuilt
- Auto-scroll and typing/analysis states: present
- Result order: SMBC Mobit, Aiful, Promise for both routes
- Final recommendation: full SMBC Mobit card appears after No.3
- Images: all retained runtime images loaded with non-zero intrinsic size after lazy-load scrolling
- Legacy aliases: query and hash preserved when forwarding to `/`
- Redirect: live browser check reached the intended SMBC Mobit destination
- Operator page: direct mobile load successful
- Keyboard: focus outline measured at 3px with 3px offset
- Tap areas: question controls 52px or greater; restart/footer links 44px
- Console: 0 errors in the final public entry and result checks

# Iterative Audits

## Audit 1: Static Search

- Scanned runtime HTML/CSS/JS/JSON/SVG and public Markdown.
- Removed old-brand assets, obsolete reference notes, copied libraries and unrelated code.
- Final automated scan: 0 broken references, 0 unused images, 0 source maps, no obsolete runtime directory.
- Product/service names that remain are used in ranking content, redirect mapping or required operator disclosure.

## Audit 2: Asset and Delivery

- Inspected all 10 retained images for dimensions, format, EXIF and metadata keys.
- EXIF entry count: zero for every retained image.
- One retained official Acom banner contains Adobe/XMP metadata; it was not altered because official affiliate assets must not be edited.
- Confirmed intrinsic dimensions in markup for all product and review images.
- Confirmed favicon and manifest references.
- Collected final GTM-injected origins and separated them from direct application imports.

## Audit 3: Display, Operation and Similarity

- Completed both diagnosis branches and all result generation.
- Checked disabled, selected, correction, typing, analysis, result, expanded-details, focus and lazy-image states.
- Checked mobile, tablet and desktop widths.
- Confirmed former image-led first view, social bubble tails, read-status treatment, cloud background, copied color system and overlapping rank-card decoration are absent.

## Independent Final Audit

- Baseline asset/code audit found the critical old-brand, unused-code and public-history issues listed above.
- Independent design audit judged the rebuilt UI a conditional pass and identified image provenance and two responsive/image presentation concerns.
- The responsive copy and review-image presentation concerns were corrected before release review.
- A separate final reviewer found no P0/P1 implementation defect, confirmed the questions, fixed ranking, four redirect identifiers, GTM and PR disclosures, and returned `CONDITIONAL PASS` for asset/GTM approval.

## Release Check

- Commit `3f45bdb` was pushed to `main` and served by GitHub Pages.
- Public smoke URL: `https://admin2-a11y.github.io/money-loan-navi-demo/?v=3f45bdb`
- Completed the beginner route on the public site at a mobile viewport.
- Confirmed SMBC Mobit, Aiful and Promise in positions No.1 through No.3, followed by the full SMBC Mobit recommendation.
- Confirmed no horizontal overflow and no console errors on the public entry and result views.

# Unresolved Items

## P0

- None.

## P1

- Owner must confirm rights/provenance for the site logo and advisor image.
- Owner must confirm the retained banners, review images and convenience-store logos are approved for this deployment.
- Owner must approve the GTM downstream domain list and review the two injected insecure URLs.

## P2

- Product conditions and the product summaries on the operator page require owner freshness/advertising review.
- The official Acom banner retains its supplied XMP metadata; source approval should be documented rather than stripping it.
- No automated browser-test framework exists; browser E2E evidence is manual.

# Final Decision Basis

The code and UI meet the technical remediation requirements: suspected legacy material was removed, the application was independently rebuilt, required business behavior was preserved, all available tests pass, and responsive/browser checks pass. A full PASS is not issued because the requested allowlists were left blank, retained asset provenance cannot be proven from the repository, and GTM creates third-party requests whose contractual approval must be confirmed by the owner.
