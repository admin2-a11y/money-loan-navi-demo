(() => {
  "use strict";

  const linkMap = {
    acom: {
      url: "https://ac.rextjapan-finance.com/6fd7y7yj5d0b7b04/cl/?bId=k16c4161",
      banner: "images/banner_acom.jpg",
      alt: "アコム"
    },
    promise: {
      url: "https://ac.rextjapan-finance.com/6fd7y7yj5d0b7b04/cl/?bId=681662bS",
      banner: "images/banner_promise.jpg",
      alt: "プロミス"
    },
    mobit: {
      url: "https://ac.rextjapan-finance.com/6fd7y7yj5d0b7b04/cl/?bId=d4541636",
      banner: "images/banner_mobit.jpg",
      alt: "SMBCモビット"
    },
    aiflu: {
      url: "https://ac.rextjapan-finance.com/6fd7y7yj5d0b7b04/cl/?bId=6146a11d",
      banner: "images/banner_aiful.jpg",
      alt: "アイフル"
    }
  };

  const trackingKeys = new Set(["ttclid", "ycid", "fbclid", "gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]);
  const params = new URLSearchParams(window.location.search);
  const item = linkMap[params.get("item")] ? params.get("item") : "acom";
  const selected = linkMap[item];
  const destination = new URL(selected.url);

  try {
    const stored = new URLSearchParams(localStorage.getItem("queryParams") || "");
    stored.forEach((value, key) => {
      if (trackingKeys.has(key)) destination.searchParams.set(key, value);
    });
  } catch (error) {
    // Redirect remains functional when browser storage is unavailable.
  }

  params.forEach((value, key) => {
    if (trackingKeys.has(key)) destination.searchParams.set(key, value);
  });

  const destinationUrl = destination.toString();
  const title = document.getElementById("redirect-title");
  const banner = document.getElementById("redirect-banner");
  const image = document.getElementById("redirect-image");
  const fallback = document.getElementById("fallback-link");

  title.textContent = `${selected.alt}のサイトへ移動中です。`;
  banner.href = destinationUrl;
  image.src = selected.banner;
  image.alt = selected.alt;
  fallback.href = destinationUrl;

  window.setTimeout(() => {
    window.location.assign(destinationUrl);
  }, 1000);
})();
