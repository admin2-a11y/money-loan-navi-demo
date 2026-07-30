(() => {
  "use strict";

  const trackingKeys = Object.freeze([
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
    "utm_source_platform",
    "utm_creative_format",
    "utm_marketing_tactic",
    "gclid",
    "dclid",
    "wbraid",
    "gbraid",
    "fbclid",
    "msclkid",
    "yclid",
    "ttclid",
    "srsltid"
  ]);
  const trackingKeySet = new Set(trackingKeys);

  // These values describe the diagnosis itself. They are needed when the
  // survey form is submitted, but must not be inherited as tracking data by
  // later internal links or lender CTAs.
  const surveyKeys = Object.freeze([
    "variant",
    "s",
    "post_type",
    "speed",
    "amount",
    "method",
    "income",
    "job",
    "company_size",
    "duration",
    "priority",
    "sort_order",
    "current_loans[]",
    "current_loans",
    "mln-content-kind",
    "mln-entry-choice",
    "select_modal",
    "entry-modal",
    "view",
    "qa",
    "demo-fix",
    "v"
  ]);
  const surveyKeySet = new Set(surveyKeys);

  const isSurveyKey = (key) => surveyKeySet.has(key);

  const collectCarryParams = () => {
    const current = new URLSearchParams(window.location.search);
    const carried = new URLSearchParams();
    current.forEach((value, key) => {
      if (!isSurveyKey(key)) carried.append(key, value);
    });
    return carried;
  };

  const collectTrackingParams = () => {
    const current = new URLSearchParams(window.location.search);
    const tracking = new URLSearchParams();
    current.forEach((value, key) => {
      if (trackingKeySet.has(key)) tracking.append(key, value);
    });
    return tracking;
  };

  const stripSurveyParams = (params) => {
    [...params.keys()].forEach((key) => {
      if (isSurveyKey(key)) params.delete(key);
    });
  };

  const appendMissingParams = (destination, carried) => {
    const destinationKeys = new Set(destination.keys());
    carried.forEach((value, key) => {
      if (!destinationKeys.has(key)) destination.append(key, value);
    });
  };

  const decorateAnchor = (anchor, carried) => {
    const raw = anchor.getAttribute("href");
    if (!raw || raw.startsWith("#") || /^(?:mailto|tel|javascript):/i.test(raw)) return;

    const target = new URL(raw, window.location.href);
    if (!/^https?:$/.test(target.protocol)) return;

    stripSurveyParams(target.searchParams);
    appendMissingParams(target.searchParams, carried);

    if (anchor.href !== target.href) anchor.href = target.href;
  };

  const decorateLinks = (root, carried) => {
    if (root instanceof HTMLAnchorElement) decorateAnchor(root, carried);
    if (!(root instanceof Element || root instanceof Document)) return;
    root.querySelectorAll("a[href]").forEach((anchor) => decorateAnchor(anchor, carried));
  };

  const decorateForms = (carried) => {
    if (!carried.toString()) return;
    for (const form of document.forms) {
      const destinationKeys = new Set(
        Array.from(form.elements || [], (control) => control.name).filter(Boolean)
      );
      carried.forEach((value, key) => {
        if (destinationKeys.has(key)) return;
        const field = document.createElement("input");
        field.type = "hidden";
        field.name = key;
        field.value = value;
        field.dataset.mlnCarriedParam = "1";
        form.append(field);
      });
    }
  };

  const initialize = () => {
    const carried = collectCarryParams();
    decorateLinks(document, carried);
    decorateForms(carried);

    const observer = new MutationObserver((records) => {
      const current = collectCarryParams();
      records.forEach((record) => {
        if (record.type === "attributes") {
          decorateAnchor(record.target, current);
          return;
        }
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) decorateLinks(node, current);
        });
      });
    });
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["href"]
    });

    // Re-apply immediately before navigation in case another integration has
    // decorated the URL after page initialization.
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (target) decorateAnchor(target, collectCarryParams());
    }, true);
  };

  window.moneyLoanCurrentParams = () => collectCarryParams().toString();
  window.moneyLoanCarryParams = () => collectCarryParams().toString();
  window.moneyLoanTrackingParams = () => collectTrackingParams().toString();
  window.moneyLoanTrackingKeys = trackingKeys.slice();
  window.moneyLoanSurveyKeys = surveyKeys.slice();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
