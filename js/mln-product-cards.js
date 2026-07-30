(() => {
  "use strict";

  const mountPoint = document.querySelector("[data-mln-product-result-cards]");
  if (!mountPoint) return;

  const lenderUrls = window.MLN_LENDER_URLS || {};

  const products = [
    {
      key: "mobit",
      url: lenderUrls.mobit || "",
      name: "SMBCモビット",
      sponsor: "三井住友カード株式会社",
      banner: ["banner_mobit.jpg", 400, 333],
      catchCopy: ["10秒簡易審査ですぐ結果がわかる！", ""],
      actionCopy: ["10秒簡易審査を試す", ""],
      specifications: [["融資時間", "最短15分"], ["実質年率", "3.0％～18.0％"], ["利用限度額", "最大800万円"], ["事前審査", "10秒簡易審査"], ["利用方法", "振込・コンビニATM"]],
      points: [["お申込みから最短15分で審査完了！", "お申し込みから最短15分で審査するから急な出費にも即対応！"], ["振込は最短3分", "ご契約後、最短3分で口座へ振り込まれる！"], ["原則電話連絡・郵送物なし", "面倒な電話連絡や郵送物はないから誰にもバレなくて安心！"], ["返済でVポイントが貯まる・使える", "返済の利息分でVポイントが貯まるからお得！"]],
      review: {
        profile: ["職業：派遣", "年齢：47歳", "400万円"],
        rating: 5,
        amount: "50万未満",
        time: "1時間以内",
        copy: "事前に身分証明書を準備して申し込み。審査もスムーズに進みました！すべてスマホで完結できたので、誰にもバレずにすぐ着金。もっと早く利用すれば良かったです！",
        image: ["review-mobit-v2.png", 172, 185, "mobit"],
      },
      noteLines: ["※お申込の曜日、時間帯によっては翌日以降の取扱となる場合があります。※原則電話連絡なし。（WEB完結申込の場合）※口座への入金が完了する日時は金融機関によって異なります。※サービス内容は公式サイトで最新情報をご確認ください。※一例であり、結果を保証するものではありません。"],
    },
    {
      key: "promise",
      url: lenderUrls.promise || "",
      name: "プロミス",
      sponsor: "SMBCコンシューマーファイナンス株式会社",
      banner: ["banner_promise.jpg", 300, 250],
      catchCopy: ["Webなら最短3分で融資可能", ""],
      actionCopy: ["1秒パパッと診断を試す", ""],
      specifications: [["融資時間", "最短3分"], ["実質年率", "2.5％～18.0％"], ["利用限度額", "最大800万円"], ["無利息期間", "初回借入の翌日から30日間"], ["事前診断", "1秒パパッと診断"]],
      points: [["即日可能！最短3分で審査完了！", "21時までの申込みで即日融資可能！"], ["30日間無利息もありお得に借りれる！", "初回借入の翌日から30日間、条件を満たす方は無利息で利用できます。"], ["1秒パパっと診断", "借り入れ可能かすぐチェックできる！"]],
      review: {
        profile: ["職業：会社員", "年齢：33歳", "300万円"],
        rating: 5,
        amount: "50万円未満",
        time: "1時間以内",
        copy: "スマホで完結できるので審査から借入までがとにかく早い。誰にもバレずに借りることが出来ました。返済も月1000円からで良いのも助かってます。",
        image: ["review-promise-v2.png", 194, 190, "promise"],
      },
      noteLines: ["※無利息期間の適用にはメールアドレス登録とWeb明細利用の登録が必要です。※お申込時間や審査状況によりご希望に添えない場合があります。※サービス内容は公式サイトで最新情報をご確認ください。※一例であり、結果を保証するものではありません。"],
    },
    {
      key: "aiful",
      url: lenderUrls.aiful || "",
      name: "アイフル",
      sponsor: "アイフル株式会社",
      banner: ["banner_aiful-9min.webp", 300, 250],
      catchCopy: ["最短9分で融資可能※1", ""],
      actionCopy: ["1秒診断で借り入れ可能か確認する", ""],
      specifications: [["融資時間", "最短9分※1"], ["実質年率", "3.0％～18.0％"], ["利用限度額", "800万円以内"], ["無利息期間", "初めての方なら最大30日間"], ["事前診断", "1秒診断"]],
      points: [["今日借りられる！申込みから融資まで最短9分※1", "Webから24時間365日申し込み可！"], ["無利息で借りられる期間あり！", "初めての方なら最大30日間利息0円。"], ["原則、勤務先への電話連絡なし", "申込みから借入・返済までWebで完結できるので家族や職場にバレない。"], ["1秒診断で借入可能性を確認", "年齢・年収・他社借入金額などから簡易的に確認できます。"]],
      review: {
        profile: ["職業：会社員", "年齢：54歳", "390万円"],
        rating: 5,
        amount: "100万～300万円未満",
        time: "1時間以内",
        copy: "急な出費があり、初めてカードローンを利用しました。短期間で返済する予定だったため、30日間の無利息サービスを利用できた点に満足しています。※2",
        showDisclaimer: false,
        image: ["review-aiful-v2.png", 181, 192, "aiful"],
      },
      noteLines: ["※1申込手続き完了時点から計測した最短時間であり、申込時間や審査状況などにより異なります。※2一例であり、結果を保証するものではありません。"],
    },
  ];

  const create = (tagName, className = "", text = null) => {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text !== null) node.textContent = text;
    return node;
  };

  const addReference = (parent, reference) => {
    if (reference) parent.append(create("sup", "mln-product-note-ref", reference));
    return parent;
  };

  const createTextWithReference = (tagName, className, text, reference) => {
    const node = create(tagName, className);
    node.append(document.createTextNode(text));
    return addReference(node, reference);
  };

  const createProductLink = (product, className, text) => {
    const link = create("a", className, text);
    link.href = product.url;
    link.target = "_blank";
    link.rel = "sponsored noopener";
    return link;
  };

  const createPointList = (items, extraClass = "") => {
    const list = create("ul", `mln-product-points${extraClass ? ` ${extraClass}` : ""}`);
    items.forEach(([title, body, titleReference, bodyReference]) => {
      const item = create("li");
      item.append(
        createTextWithReference("strong", "", title, titleReference),
        createTextWithReference("span", "", body, bodyReference),
      );
      list.append(item);
    });
    return list;
  };

  const createToggle = () => {
    const summary = create("summary");
    summary.append(
      create("span", "mln-product-more-open", "もっと見る"),
      create("span", "mln-product-more-close", "閉じる"),
    );
    return summary;
  };

  const createSpecifications = (product) => {
    const ringLabels = new Set(["融資時間", "実質年率", "利用限度額", "無利息期間", "事前審査", "事前診断", "利用方法"]);
    const list = create("dl", "mln-product-specs");
    product.specifications.forEach(([label, value, reference]) => {
      const row = create("div", ringLabels.has(label) ? "mln-product-spec-ring" : "");
      row.append(create("dt", "", label), createTextWithReference("dd", "", value, reference));
      list.append(row);
    });
    const convenience = create("div", "mln-product-conveni");
    const value = create("dd");
    const crop = create("span", "mln-product-conveni-logo-crop");
    const logos = create("img");
    logos.src = "./images/convenience-store-logos-360.webp";
    logos.width = 360;
    logos.height = 87;
    logos.alt = "利用可能な提携コンビニATM：セブン-イレブン、ファミリーマート、ローソン、ミニストップ";
    logos.loading = "lazy";
    logos.decoding = "async";
    crop.append(logos);
    value.append(crop);
    convenience.append(create("dt", "", "利用コンビニ"), value);
    list.append(convenience);
    return list;
  };

  const createReviewProfile = (product) => {
    const caption = create("figcaption");
    caption.append(
      document.createTextNode(product.review.profile[0]),
      create("br"),
      document.createTextNode(product.review.profile[1]),
    );
    if (product.review.profile[2]) {
      caption.append(create("span", "mln-product-review-income", `年収：${product.review.profile[2]}`));
    }
    if (product.review.rating) {
      const rating = create("span", "mln-product-review-rating");
      rating.setAttribute("aria-label", `評価5点満点中${product.review.rating}点`);
      const stars = create("span", "", "★★★★★");
      stars.setAttribute("aria-hidden", "true");
      rating.append(stars, create("b", "", String(product.review.rating)));
      caption.append(rating);
    }
    return caption;
  };

  const createReviewBubble = (className, product, includeNote) => {
    const bubble = create("div", className);
    bubble.append(create("p", "mln-product-review-text", product.review.copy));
    if (includeNote && product.review.showDisclaimer !== false) {
      bubble.append(create("small", "", product.review.disclaimer || "※一例であり、結果を保証するものではありません。"));
    }
    return bubble;
  };

  const createCountdownContents = (countdown, nextMorning = false) => {
    if (nextMorning) {
      const emphasis = create("strong", "", "最短10時");
      const body = create("b");
      body.append(emphasis, document.createTextNode("に借入完了も！"));
      countdown.replaceChildren(create("span", "", "いま申込で"), body);
      return;
    }
    const body = create("b");
    body.append(document.createTextNode("残り "));
    const units = [["hours", "時間"], ["minutes", "分"], ["seconds", "秒"], ["centiseconds", ""]];
    units.forEach(([unit, suffix], index) => {
      const value = create("i", "", "00");
      value.setAttribute(`data-mln-product-${unit}`, "");
      body.append(value);
      if (suffix) body.append(document.createTextNode(suffix));
      if (index === 2) body.append(document.createTextNode(""));
    });
    countdown.replaceChildren(create("span", "", "本日中に借りるなら"), body);
  };

  const createCard = (product, rank, featured = false) => {
    const card = create("article", `mln-product-lender-card${featured ? " mln-product-lender-card-final" : ""}`);
    card.setAttribute("data-mln-product-lender", product.key);

    const titlebar = create("div", "mln-product-lender-titlebar");
    const name = create("h3", "mln-product-lender-name");
    const crown = create("span", "mln-product-crown", "♛");
    crown.setAttribute("aria-hidden", "true");
    name.append(crown, document.createTextNode(" "), createProductLink(product, "", product.name));
    titlebar.append(name, create("p", "mln-product-lender-rank", featured ? "当サイトおすすめ" : `おすすめ順 No.${rank}`));

    const heading = createTextWithReference("p", "mln-product-lender-catch", product.catchCopy[0], product.catchCopy[1]);
    const head = create("div", "mln-product-lender-head");
    const bannerLink = createProductLink(product, "mln-product-lender-banner", "");
    const banner = create("img");
    banner.src = `./images/${product.banner[0]}`;
    banner.width = product.banner[1];
    banner.height = product.banner[2];
    banner.alt = `${product.name}公式サイトへ`;
    banner.loading = "lazy";
    bannerLink.append(banner);
    if (product.banner[3]) bannerLink.append(create("small", "mln-product-banner-ref", product.banner[3]));
    const summary = create("div", "mln-product-lender-summary");
    summary.append(createSpecifications(product));
    head.append(bannerLink, summary);

    const recommendation = create("section", "mln-product-recommend");
    recommendation.setAttribute("aria-label", "ここがオススメ");
    const recommendationTitle = create("h4", "mln-product-recommend-title");
    recommendationTitle.append(create("span", "mln-product-check-badge", "CHECK"), create("span", "", "ここがオススメ"));
    const pointsDetails = create("details", "mln-product-points-more");
    pointsDetails.append(createToggle(), createPointList(product.points));
    recommendation.append(
      recommendationTitle,
      createPointList(product.points.slice(0, 2), "mln-product-points-preview"),
      pointsDetails,
    );

    const review = create("section", "mln-product-review-box");
    review.setAttribute("aria-label", "利用者の口コミ");
    review.append(create("h4", "mln-product-review-title", "● 利用者の口コミは？"));
    const reviewLayout = create("div", "mln-product-review-layout");
    const portrait = create("figure", `mln-product-review-avatar is-${product.review.image[3]}`);
    const portraitImage = create("img");
    portraitImage.src = `./images/${product.review.image[0]}`;
    portraitImage.width = product.review.image[1];
    portraitImage.height = product.review.image[2];
    portraitImage.alt = "口コミ利用者";
    portraitImage.loading = "lazy";
    portraitImage.decoding = "async";
    portrait.append(portraitImage, createReviewProfile(product));
    const reviewCopy = create("div", "mln-product-review-copy");
    const facts = create("div", "mln-product-review-facts");
    facts.append(create("span", "", `借入額：${product.review.amount}`), create("span", "", `借入までの時間：${product.review.time}`));
    const reviewDetails = create("details", "mln-product-review-more");
    reviewDetails.append(createToggle(), createReviewBubble("mln-product-review mln-product-review-bubble", product, true));
    reviewCopy.append(facts, createReviewBubble("mln-product-review-preview mln-product-review-bubble", product, false), reviewDetails);
    reviewLayout.append(portrait, reviewCopy);
    review.append(reviewLayout);

    const action = create("div", "mln-product-cta-wrap");
    const countdown = create("div", "mln-product-countdown");
    countdown.setAttribute("data-mln-product-countdown", "");
    countdown.setAttribute("aria-live", "polite");
    createCountdownContents(countdown);
    action.append(
      countdown,
      createTextWithReference("span", "mln-product-cta-bubble", product.actionCopy[0], product.actionCopy[1]),
      createProductLink(product, "mln-product-cta", "詳しくはこちら"),
    );

    const note = create("p", "mln-product-lender-note");
    note.append(document.createTextNode(`【PR】Sponsored by ${product.sponsor}`), create("br"));
    product.noteLines.forEach((line, index) => {
      if (index) note.append(create("br"));
      note.append(document.createTextNode(line));
    });

    card.append(titlebar, heading, head, recommendation, review, action, note);
    return card;
  };

  const order = ["mobit", "aiful", "promise"];
  const productMap = new Map(products.map((product) => [product.key, product]));
  const rankedProducts = order.map((key) => productMap.get(key)).filter(Boolean);
  const resultSection = create("section", "mln-product-result-cards");
  resultSection.setAttribute("aria-label", "カードローン診断結果");
  const list = create("div", "mln-product-lender-list");
  rankedProducts.forEach((product, index) => list.append(createCard(product, index + 1)));
  resultSection.append(list);

  if (mountPoint.dataset.mlnProductContext !== "top") {
    const finalPick = create("section", "mln-product-final-pick");
    finalPick.setAttribute("aria-label", "当サイトの最終おすすめ");
    const intro = create("div", "mln-product-recommend-intro");
    const title = create("h2");
    title.append(create("span", "", "即日で借りたいなら"), create("span", "", "このカードローン"));
    const introCopy = create("p");
    introCopy.append(
      document.createTextNode("すぐにお金が必要だけど家族や会社にバレたくないし"),
      create("br"),
      document.createTextNode("できればおトクに借りたい…！"),
      create("br"),
      document.createTextNode("そんなあなたにこちらのカードローンがおすすめです！"),
    );
    intro.append(create("p", "mln-product-recommend-intro-label", "＼ おすすめ ／"), title, introCopy);
    const finalMount = create("div");
    finalMount.setAttribute("data-mln-product-final-mobit", "");
    finalMount.append(createCard(productMap.get("mobit"), 1, true));
    finalPick.append(intro, finalMount);
    resultSection.append(finalPick);
  }
  mountPoint.replaceChildren(resultSection);

  document.querySelectorAll("[data-mln-product-top-final-mobit]").forEach((target) => {
    target.replaceChildren(createCard(productMap.get("mobit"), 1, true));
  });

  const pad = (value) => String(value).padStart(2, "0");
  const countdowns = Array.from(document.querySelectorAll("[data-mln-product-countdown]"));
  const setCountdownValue = (countdown, unit, value) => {
    const node = countdown.querySelector(`[data-mln-product-${unit}]`);
    if (node && node.textContent !== value) node.textContent = value;
  };
  const refreshCountdowns = (now, schedulerState = {}) => {
    const beforeCutoff = now.getHours() < 21;
    const deadline = new Date(now);
    deadline.setHours(21, 0, 0, 0);
    const remaining = deadline.getTime() - now.getTime();
    countdowns.forEach((countdown) => {
      countdown.hidden = false;
      if (!beforeCutoff || remaining <= 0) {
        if (!countdown.classList.contains("is-next-morning")) {
          countdown.classList.add("is-next-morning");
          createCountdownContents(countdown, true);
        }
        return;
      }
      if (countdown.classList.contains("is-next-morning")) {
        countdown.classList.remove("is-next-morning");
        createCountdownContents(countdown);
      }
      const seconds = Math.floor(remaining / 1000);
      setCountdownValue(countdown, "hours", pad(Math.floor(seconds / 3600)));
      setCountdownValue(countdown, "minutes", pad(Math.floor((seconds % 3600) / 60)));
      setCountdownValue(countdown, "seconds", pad(seconds % 60));
      setCountdownValue(countdown, "centiseconds", schedulerState.reducedMotion ? "00" : pad(Math.floor((remaining % 1000) / 10)));
    });
    return beforeCutoff && remaining > 0 ? 50 : 1000;
  };
  if (countdowns.length && window.MoneyLoanCountdownScheduler) {
    window.MoneyLoanCountdownScheduler.add(refreshCountdowns);
  } else if (countdowns.length) {
    refreshCountdowns(new Date(), { reducedMotion: true });
  }

  document.querySelectorAll(".mln-product-points-more > summary, .mln-product-review-more > summary").forEach((summary) => {
    summary.addEventListener("keydown", (event) => {
      if (!["Enter", " ", "Spacebar"].includes(event.key)) return;
      event.preventDefault();
      summary.parentElement.open = !summary.parentElement.open;
    });
  });

  document.querySelectorAll(".mln-product-recommend, .mln-product-review-box").forEach((panel) => {
    panel.addEventListener("click", (event) => {
      if (event.target.closest("summary, a, button, input, select, textarea, label")) return;
      if (window.getSelection()?.toString()) return;
      const details = panel.querySelector("details");
      if (details) details.open = !details.open;
    });
  });
})();
