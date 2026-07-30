(function () {
  "use strict";

  var TRACKING_KEYS = ["ttclid", "ycid", "fbclid", "gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  var links = {
    acom: {
      url: "https://ac.rextjapan-finance.com/6fd7y7yj5d0b7b04/cl/?bId=k16c4161",
      banner: "images/banner_acom.jpg",
      bannerWidth: 300,
      bannerHeight: 250,
      name: "アコム"
    },
    promise: {
      url: "https://ac.rextjapan-finance.com/6fd7y7yj5d0b7b04/cl/?bId=681662bS",
      banner: "images/banner_promise.jpg",
      bannerWidth: 320,
      bannerHeight: 250,
      name: "プロミス"
    },
    mobit: {
      url: "https://ac.rextjapan-finance.com/6fd7y7yj5d0b7b04/cl/?bId=d4541636",
      banner: "images/banner_mobit.jpg",
      bannerWidth: 480,
      bannerHeight: 400,
      name: "SMBCモビット"
    },
    aiflu: {
      url: "https://ac.rextjapan-finance.com/6fd7y7yj5d0b7b04/cl/?bId=6146a11d",
      banner: "images/banner_aiful.jpg",
      bannerWidth: 300,
      bannerHeight: 250,
      name: "アイフル"
    }
  };

  function storedParameters() {
    try {
      return window.localStorage.getItem("moneyLoanNaviQueryParams") || window.localStorage.getItem("queryParams") || "";
    } catch (error) {
      return "";
    }
  }

  function destinationUrl(baseUrl) {
    var target = new URL(baseUrl);
    var merged = new URLSearchParams(storedParameters());
    var current = new URLSearchParams(window.location.search);
    current.forEach(function (value, key) {
      if (TRACKING_KEYS.indexOf(key) !== -1) merged.set(key, value);
    });
    merged.forEach(function (value, key) {
      if (TRACKING_KEYS.indexOf(key) !== -1) target.searchParams.set(key, value);
    });
    return target.toString();
  }

  var params = new URLSearchParams(window.location.search);
  var item = params.get("item");
  var selected = links[item] || links.acom;
  var targetUrl = destinationUrl(selected.url);
  var heading = document.getElementById("redirect-title");
  var bannerMount = document.getElementById("redirect-banner");

  heading.textContent = selected.name + "のサイトへ移動中です。";

  var anchor = document.createElement("a");
  anchor.href = targetUrl;
  anchor.rel = "sponsored";
  var image = document.createElement("img");
  image.src = selected.banner;
  image.alt = selected.name + "の公式広告";
  image.width = selected.bannerWidth;
  image.height = selected.bannerHeight;
  anchor.appendChild(image);
  bannerMount.appendChild(anchor);

  window.setTimeout(function () {
    window.location.replace(targetUrl);
  }, 1000);
}());
