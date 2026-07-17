# Money Loan Navi Review Handoff

Updated: 2026-07-17

## Scope

- Entry and diagnosis: `/`
- Legacy entry aliases: `/demo.html`, `/chat-demo.html`
- Operator information: `/operationinfo.html`
- Affiliate handoff: `/redirect.html?item=...`
- Public runtime: root HTML, `css/`, `js/`, `images/`, favicon and manifest

## Delivered

- Rebuilt the entry, guided questions, answer history and result view as one independent static application.
- Replaced the former image-led first view with a structured two-column entry and stacked mobile layout.
- Replaced the former social-message styling with neutral advisor turns, answer receipts and a standard progress rail.
- Consolidated runtime styling into `css/app.css` and runtime behavior into `js/app.js` plus `js/redirect.js`.
- Removed legacy libraries, unused assets, duplicate generations, broken local references and source maps.
- Added an original lightweight `favicon.svg` and `site.webmanifest`.
- Kept the required GTM container, PR labels, notes, operator information and affiliate redirects.
- Reworked result cards with a neutral design system while preserving approved product banners and review images.

## Preserved Flow

### First View

- `経験がある`
- `はじめて`

### Experienced-Only Question

- Previously used card loans, multiple choice
- Acom / Promise / SMBC Mobit / Aiful / other or cannot remember
- The next button remains disabled until at least one item is selected.

### Shared Questions

1. Priority
2. Desired amount
3. Desired timing
4. Borrowing method
5. Age
6. Occupation
7. Annual income

Answers are recorded with `です`, can be corrected, and are copied into the hidden diagnosis data form.

## Result Rules

- All answer combinations display the same ranking requested by the owner.
- No.1: SMBC Mobit
- No.2: Aiful
- No.3: Promise
- After No.3, the complete SMBC Mobit card is shown again as the final recommendation.
- Product links continue through `redirect.html`; tracking query parameters are retained.

## Responsive Work

- Entry choices: 112px minimum on mobile, 142px on wider layouts.
- Question controls: 52px minimum.
- Restart and footer links: 44px minimum target area.
- Controlled line breaks for entry copy, result title and ranking title.
- Two-column answer summary on mobile to reduce vertical length.
- Odd summary/spec rows span the full grid instead of leaving a colored empty cell.
- Product banners use intrinsic dimensions and `object-fit: contain`.
- Review images use a non-cropping rectangular presentation.
- Verified without horizontal scrolling at 320, 375, 390, 414, 768, 1280 and 1440px.

## Protected Items

- GTM container `GTM-TQHV5GQ5`
- PR disclosure and sponsored labels
- Product notes and qualification notes
- `moment合同会社` operator information
- Affiliate redirect identifiers for Acom, Promise, SMBC Mobit and Aiful
- Official affiliate banners, review images and convenience-store logo strip

## Validation Commands

- `node scripts/site-audit.mjs`
- `node --check js/app.js`
- `node --check js/redirect.js`
- `node --test tests/site.test.mjs`
- `git diff --check`

This is a dependency-free static site. There is no TypeScript compiler or separate integration-test framework. The main integration and E2E checks were performed in the browser.

## Human Confirmation Required

- Confirm ownership or usage rights for the site logo and advisor image.
- Confirm the supplied official banners, review images and convenience-store logos are approved for this deployment.
- Confirm every downstream destination configured inside GTM. The source contains only GTM, but GTM injects additional advertising and analytics providers at runtime.
- Confirm that product copy, product conditions and operator-information product summaries are current. Advertising review remains the owner's responsibility.
- Confirm the retained tracking and affiliate domains are included in the project's approved-domain list.

## Release

- Baseline before this work: `6125abf`
- Rollback: redeploy the baseline commit or revert the new audit commit.
- Do not publish the local `audit-evidence` screenshots; they are implementation evidence only.
