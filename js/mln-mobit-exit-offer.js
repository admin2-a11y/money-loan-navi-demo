(() => {
  "use strict";

  const mobitUrl = window.MLN_LENDER_URLS?.mobit || "";
  const resultsScreen = document.getElementById("results-screen");
  if (!mobitUrl || !resultsScreen) return;

  let armed = false;
  let shown = false;
  let overlay = null;
  let lastFocusedElement = null;
  let armTimer = 0;

  const hideOffer = () => {
    if (!overlay) return;
    overlay.dataset.mlnExitVisible = "false";
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("mln-exit-offer-open");
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  };

  const buildOffer = () => {
    const shell = document.createElement("div");
    shell.className = "mln-exit-offer";
    shell.dataset.mlnExitVisible = "false";
    shell.setAttribute("aria-hidden", "true");

    const panel = document.createElement("section");
    panel.className = "mln-exit-offer__panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "SMBCモビットのご案内");

    const closeButton = document.createElement("button");
    closeButton.className = "mln-exit-offer__close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "ポップアップを閉じる");
    closeButton.textContent = "×";

    const content = document.createElement("div");
    content.className = "mln-exit-offer__content";

    const bannerLink = document.createElement("a");
    bannerLink.href = mobitUrl;
    bannerLink.target = "_blank";
    bannerLink.rel = "sponsored noopener";
    bannerLink.setAttribute("aria-label", "SMBCモビット公式サイトで詳細を確認する");

    const banner = document.createElement("img");
    banner.className = "mln-exit-offer__banner";
    banner.src = "./images/banner_mobit.jpg";
    banner.width = 400;
    banner.height = 333;
    banner.alt = "SMBCモビット公式サイトへ";
    bannerLink.append(banner);

    const cta = document.createElement("a");
    cta.className = "mln-exit-offer__cta";
    cta.href = mobitUrl;
    cta.target = "_blank";
    cta.rel = "sponsored noopener";
    cta.textContent = "詳しくはこちら";

    content.append(bannerLink, cta);
    panel.append(closeButton, content);
    shell.append(panel);

    closeButton.addEventListener("click", hideOffer);
    shell.addEventListener("click", (event) => {
      if (event.target === shell) hideOffer();
    });
    panel.addEventListener("click", (event) => event.stopPropagation());
    document.body.append(shell);
    return shell;
  };

  const showOffer = () => {
    if (shown) return;
    shown = true;
    lastFocusedElement = document.activeElement;
    overlay ||= buildOffer();
    overlay.dataset.mlnExitVisible = "true";
    overlay.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("mln-exit-offer-open");
    requestAnimationFrame(() => overlay.querySelector(".mln-exit-offer__close")?.focus());
  };

  const armBackAttempt = () => {
    if (armed || resultsScreen.hidden) return;
    armed = true;
    history.pushState({ mlnMobitExitOfferGuard: true }, "", location.href);
  };

  const scheduleArm = () => {
    if (armed || armTimer) return;
    armTimer = window.setTimeout(() => {
      armTimer = 0;
      armBackAttempt();
    }, 900);
  };

  window.addEventListener("popstate", () => {
    if (armed && !shown) showOffer();
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay || overlay.dataset.mlnExitVisible !== "true") return;
    if (event.key === "Escape") {
      event.preventDefault();
      hideOffer();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...overlay.querySelectorAll("button, a[href]")];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const observer = new MutationObserver(() => {
    if (!resultsScreen.hidden) {
      scheduleArm();
      observer.disconnect();
    }
  });
  observer.observe(resultsScreen, { attributes: true, attributeFilter: ["hidden"] });
  if (!resultsScreen.hidden) scheduleArm();
})();
