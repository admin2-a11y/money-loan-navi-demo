(function () {
  var started = false;
  var selectedExperience = "experience_no";
  var renderToken = 0;
  var messageDelay = 1050;
  var optionDelay = 650;
  var resultOrders = {
    experience_yes: ["mobit", "aiflu", "acom", "promise"],
    experience_no: ["promise", "mobit", "acom", "aiflu"],
  };
  var productMeta = {
    acom: {
      name: "アコム",
      company: "三菱UFJフィナンシャル・グループ",
      banner: "images/banner_acom2.jpg",
      bannerAlt: "アコム",
      points: [
        "スピードと使いやすさを重視したい方に向いています",
        "Web申込、来店不要、カードレス契約も選べます",
        "はじめての契約なら無利息期間も確認できます",
      ],
      review: "申込前に条件や必要書類を確認でき、スマホで進めやすかったという声があります。",
      specs: [
        ["審査時間", "最短20分※2"],
        ["融資時間", "最短20分※2"],
        ["借入限度額", "1万円〜800万円"],
        ["実質年率", "2.4%〜17.9%"],
        ["利用可能コンビニ", "セブン / ローソン / E-net"],
      ],
      sponsor: "【PR】Sponsored by アコム株式会社",
    },
    mobit: {
      name: "SMBCモビット",
      company: "三井住友カード株式会社",
      banner: "images/banner_mobit.jpg",
      bannerAlt: "SMBCモビット",
      points: [
        "WEB完結で進めたい方に向いています",
        "電話連絡や郵送物を抑えたい場合に確認しやすい候補です",
        "カードレスで使いたい方も条件を確認できます",
      ],
      review: "Webで手続きを進められる点や、郵送物を抑えられる点を重視する声があります。",
      specs: [
        ["審査時間", "10秒簡易審査"],
        ["融資時間", "最短15分※"],
        ["借入限度額", "最大800万円"],
        ["実質年率", "3.0%〜18.0%"],
        ["利用可能コンビニ", "セブン / ローソン / E-net"],
      ],
      sponsor: "【PR】Sponsored by 三井住友カード株式会社",
    },
    promise: {
      name: "プロミス",
      company: "SMBCコンシューマーファイナンス株式会社",
      banner: "images/banner_promise.jpg",
      bannerAlt: "プロミス",
      points: [
        "スマホからスピード重視で進めたい方に向いています",
        "郵送物なし、カードレスで進めたい方も確認できます",
        "30日間無利息の条件も申込前に確認できます",
      ],
      review: "スマホで比較しながら、返済額や無利息期間を確認できたという声があります。",
      specs: [
        ["審査時間", "最短3分"],
        ["融資時間", "最短3分"],
        ["借入限度額", "最大500万円"],
        ["実質年率", "2.5%〜18.0%"],
        ["利用可能コンビニ", "セブン / ローソン / E-net"],
      ],
      sponsor: "【PR】Sponsored by SMBCコンシューマーファイナンス株式会社",
    },
    aiflu: {
      name: "アイフル",
      company: "アイフル株式会社",
      banner: "images/banner_aiful.webp",
      bannerAlt: "アイフル",
      points: [
        "1秒診断で申込前の目安を確認したい方に向いています",
        "Web申込、来店不要、カードレスで進めたい方も確認できます",
        "急ぎの借入を検討する前に条件を確認できます",
      ],
      review: "申込前に診断で目安を確認でき、条件を比較しやすかったという声があります。",
      specs: [
        ["審査時間", "WEBで最短14分※"],
        ["融資時間", "WEBで最短14分※"],
        ["借入限度額", "最大800万円"],
        ["実質年率", "3.0%〜18.0%"],
        ["利用可能コンビニ", "セブン / ローソン / E-net"],
      ],
      sponsor: "【PR】Sponsored by アイフル株式会社",
    },
  };
  var fallbackQuestions = {
    q01: {
      id: "q01",
      nextId: "q02",
      questions: [
        "早速、診断を始めましょう！",
        "カードローン選びで、最も重視することを教えてください。",
      ],
      options: {
        "金利・無利息期間": "priorityInterest",
        "融資スピード": "prioritySpeed",
        "周囲への知られにくさ": "priorityPrivacy",
        "申込みやすさ": "priorityEase",
      },
      type: "radio",
    },
    q02: {
      id: "q02",
      nextId: "q03",
      questions: ["いくら借りたいですか？"],
      options: {
        "10万円以下": "a07",
        "11〜20万円": "a08",
        "21〜30万円": "a09",
        "31万円以上": "a10",
        "こだわらない": "a11",
      },
      type: "radio",
    },
    q03: {
      id: "q03",
      nextId: "q04",
      questions: ["いつまでに借りたいですか？"],
      options: {
        "1時間以内": "a12",
        "当日中": "a13",
        "3日以内": "a14",
        "1週間以内": "a15",
        "こだわらない": "a16",
      },
      type: "radio",
    },
    q04: {
      id: "q04",
      nextId: "q05",
      questions: ["どのように借りたいですか？"],
      options: {
        "コンビニATM": "a17",
        "口座振込": "a18",
        "どちらでも": "a19",
      },
      type: "radio",
    },
    q05: {
      id: "q05",
      nextId: "q06",
      questions: [
        "ありがとうございます！次はあなた自身について教えてください。",
        "現在の年齢を教えてください。",
      ],
      options: {
        "〜19歳": "a26",
        "20〜29歳": "a27",
        "30〜69歳": "a28",
        "70歳以上": "a29",
      },
      type: "radio",
    },
    q06: {
      id: "q06",
      nextId: "q07",
      questions: ["現在の職業を教えてください。"],
      options: {
        "正社員": "a35",
        "公務員": "a36",
        "契約・派遣社員": "a37",
        "パート・アルバイト": "a38",
        "個人事業主・経営者": "a39",
        "専業主婦": "a40",
        "学生": "a41",
        "無職": "a42",
      },
      type: "radio",
    },
    q07: {
      id: "q07",
      nextId: "last",
      questions: ["現在の年収を教えてください。"],
      options: {
        "120万円未満": "a30",
        "121〜300万円": "a31",
        "301〜500万円": "a32",
        "501〜700万円": "a33",
        "701万円以上": "a34",
      },
      type: "final",
    },
    last: {
      id: "last",
      questions: ["ご回答頂いた情報からあなたにおすすめのカードローンをご紹介いたします！"],
      type: "last",
    },
  };

  function one(selector, root) {
    return (root || document).querySelector(selector);
  }

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function appendHidden(name, value) {
    var results = one("#results");
    if (!results) return;

    var existing = results.querySelector('input[name="' + name + '"]');
    if (existing) existing.remove();

    var input = document.createElement("input");
    input.type = "text";
    input.name = name;
    input.value = value;
    results.appendChild(input);
  }

  function appendParameter(itemId, answer) {
    var parameter = one("#parameter");
    if (parameter) parameter.value += String(itemId || "") + String(answer || "");
  }

  function hiddenValue(name) {
    var input = one('#results input[name="' + name + '"]');
    return input && input.value ? input.value : "";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function addScores(target, weights) {
    Object.keys(target).forEach(function (item) {
      target[item] += weights && weights[item] ? weights[item] : 0;
    });
  }

  function calculateRanking() {
    var baseOrder = resultOrders[selectedExperience] || resultOrders.experience_no;
    var scores = { acom: 0, mobit: 0, promise: 0, aiflu: 0 };
    var priorityWeights = {
      "金利・無利息期間": { acom: 22, promise: 20, aiflu: 15, mobit: 10 },
      "融資スピード": { promise: 22, acom: 16, aiflu: 14, mobit: 10 },
      "周囲への知られにくさ": { mobit: 22, promise: 17, aiflu: 14, acom: 10 },
      "申込みやすさ": { promise: 20, mobit: 18, aiflu: 16, acom: 14 },
    };
    var timingWeights = {
      "1時間以内": { promise: 14, acom: 11, aiflu: 9, mobit: 6 },
      "当日中": { promise: 11, acom: 10, aiflu: 9, mobit: 8 },
      "3日以内": { promise: 8, acom: 8, aiflu: 8, mobit: 8 },
      "1週間以内": { promise: 7, acom: 7, aiflu: 7, mobit: 7 },
      "こだわらない": { promise: 6, acom: 6, aiflu: 6, mobit: 6 },
    };
    var methodWeights = {
      "コンビニATM": { acom: 7, aiflu: 6, promise: 6, mobit: 5 },
      "口座振込": { mobit: 7, promise: 7, acom: 6, aiflu: 5 },
      "どちらでも": { promise: 5, mobit: 5, acom: 5, aiflu: 5 },
    };

    baseOrder.forEach(function (item, index) {
      scores[item] += (baseOrder.length - index) * 4;
    });
    addScores(scores, priorityWeights[hiddenValue("q01")]);
    addScores(scores, timingWeights[hiddenValue("q03")]);
    addScores(scores, methodWeights[hiddenValue("q04")]);

    var order = Object.keys(scores).sort(function (a, b) {
      if (scores[b] !== scores[a]) return scores[b] - scores[a];
      return baseOrder.indexOf(a) - baseOrder.indexOf(b);
    });
    var values = order.map(function (item) { return scores[item]; });
    var max = Math.max.apply(Math, values);
    var min = Math.min.apply(Math, values);
    var matches = {};
    order.forEach(function (item) {
      var ratio = max === min ? 0.5 : (scores[item] - min) / (max - min);
      matches[item] = 80 + Math.round(ratio * 14);
    });
    return { order: order, scores: scores, matches: matches };
  }

  function matchReasons(item) {
    var meta = productMeta[item];
    var priority = hiddenValue("q01");
    var amount = hiddenValue("q02");
    var timing = hiddenValue("q03");
    var method = hiddenValue("q04");
    var priorityReason = {
      "金利・無利息期間": meta.name + "の金利・無利息期間の条件を優先して比較",
      "融資スピード": meta.name + "の融資スピードを優先して比較",
      "周囲への知られにくさ": meta.name + "のWeb申込・郵送物などの条件を優先して比較",
      "申込みやすさ": meta.name + "のWeb申込・カードレス条件を優先して比較",
    }[priority] || meta.name + "の申込条件を総合的に比較";
    var timingReason = timing === "こだわらない"
      ? "希望額「" + amount + "」の利用条件を確認"
      : "希望時期「" + timing + "」に近いスピード条件を比較";
    var methodReason = method === "どちらでも"
      ? (selectedExperience === "experience_yes" ? "利用経験がある方の使いやすさを比較" : "初めて利用する場合の条件を比較")
      : "「" + method + "」で利用する際の条件を比較";
    return [priorityReason, timingReason, methodReason];
  }

  function updateResultOverview() {
    all("[data-summary-field]").forEach(function (field) {
      var name = field.getAttribute("data-summary-field");
      var value = hiddenValue(name);
      field.textContent = value || "こだわらない";
    });
  }

  function productIdFromCard(card) {
    var link = one('a[href*="redirect.html?item="]', card);
    if (!link) return "";
    var match = link.getAttribute("href").match(/item=([^&#]+)/);
    return match ? match[1] : "";
  }

  function buildResultCard(item, rank, card, matchScore) {
    var meta = productMeta[item];
    if (!meta) return null;
    var link = one('a[href*="redirect.html?item="]', card);
    var href = link ? link.getAttribute("href") : "redirect.html?item=" + item;
    var wrap = document.createElement("div");
    wrap.className = "result-lpo-card";
    var crownClass = rank <= 3 ? " result-crown--" + rank : " result-crown--4";

    var specs = meta.specs.map(function (spec) {
      return '<div class="result-lpo-spec"><dt>' + spec[0] + '</dt><dd>' + spec[1] + '</dd></div>';
    }).join("");
    var points = matchReasons(item).map(function (point) {
      return '<li>' + escapeHtml(point) + '</li>';
    }).join("");

    wrap.innerHTML =
      '<div class="result-lpo-head">' +
      '<a class="result-lpo-banner" target="_blank" href="' + href + '">' +
      '<img src="' + meta.banner + '" alt="' + meta.bannerAlt + '" decoding="async" loading="lazy">' +
      '</a>' +
      '<div class="result-lpo-title">' +
      '<div class="result-rank-label">おすすめ順 No.' + rank + '</div>' +
      '<h3><span class="result-crown' + crownClass + '" aria-hidden="true"></span><a target="_blank" href="' + href + '">' + meta.name + '</a></h3>' +
      '<p>' + meta.company + '</p>' +
      '<div class="result-match-score">希望条件との一致度 <strong>' + matchScore + '%</strong></div>' +
      '</div>' +
      '</div>' +
      '<section class="result-lpo-points result-match" aria-label="' + meta.name + 'が希望条件に合う理由">' +
      '<h4>おすすめポイント</h4>' +
      '<ul>' + points + '</ul>' +
      '<p class="result-match-note">入力条件に基づく比較上の目安です。審査結果を示すものではありません。</p>' +
      '</section>' +
      '<dl class="result-lpo-specs">' + specs + '</dl>' +
      '<div class="result-lpo-review"><span>口コミ例</span><p>' + meta.review + '</p></div>' +
      '<div class="result-lpo-timer"><span><strong>本日中</strong>に借入をする場合</span><span>残り <b>20</b> 時間 <b>53</b> 分 <b>38</b> 秒</span></div>' +
      '<a class="result-lpo-cta" target="_blank" href="' + href + '">公式サイトで申込条件を確認する</a>' +
      '<p class="result-lpo-pr">' + meta.sponsor + '<br>※条件や審査状況によりご希望に添えない場合があります。※一例であり、結果を保証するものではありません。</p>';
    return wrap;
  }

  function hideModal() {
    all(".select_modal, .select_modal_body").forEach(function (element) {
      element.classList.remove("active");
      element.style.display = "none";
    });
  }

  var scrollTimer = 0;

  function scrollToLatest(target) {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(function () {
      var chats = one("#chats");
      var latest = target && target.isConnected ? target : chats && chats.lastElementChild;
      if (!latest) return;

      window.requestAnimationFrame(function () {
        var rect = latest.getBoundingClientRect();
        var viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        var topSafe = 16;
        var bottomSafe = 24;

        if (rect.top >= topSafe && rect.bottom <= viewportHeight - bottomSafe) return;

        var availableHeight = viewportHeight - topSafe - bottomSafe;
        var destination = rect.height <= availableHeight
          ? window.scrollY + rect.bottom - viewportHeight + bottomSafe
          : window.scrollY + rect.top - topSafe;
        var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        window.scrollTo({
          top: Math.max(0, destination),
          behavior: reduceMotion ? "auto" : "smooth",
        });
      });
    }, 90);
  }

  function normalizeExperience(route) {
    return route === "experience_yes" ? "experience_yes" : "experience_no";
  }

  function formatReply(text) {
    var value = String(text || "").trim();
    if (!value) return value;
    if (/(です|ます|ません)$/.test(value)) return value;
    return value + "です";
  }

  function adminBubble(text) {
    var item = document.createElement("div");
    item.className = "chat_item chat_admin";
    item.innerHTML =
      '<div class="chat_admin_img"></div>' +
      '<div class="chat_admin_info">' +
      '<div class="chat_admin_name">マネーローンナビオペレーター</div>' +
      '<div class="chat_admin_text"><span>' + text + "</span></div>" +
      "</div>";
    return item;
  }

  function typingBubble() {
    var item = document.createElement("div");
    item.className = "chat_item chat_admin chat_admin--typing";
    item.setAttribute("role", "status");
    item.setAttribute("aria-label", "マネーローンナビオペレーターが入力中です");
    item.innerHTML =
      '<div class="chat_admin_img"></div>' +
      '<div class="chat_admin_info">' +
      '<div class="chat_admin_name">マネーローンナビオペレーター</div>' +
      '<div class="chat_admin_text chat_admin_typing" aria-hidden="true">' +
      '<span></span><span></span><span></span>' +
      "</div>" +
      "</div>";
    return item;
  }

  function userBubble(itemId, text) {
    var item = document.createElement("div");
    item.className = "chat_item chat_user";
    item.setAttribute("data-itemid", itemId);
    item.innerHTML = '<div class="chat_user_text">' + text + "</div>";
    return item;
  }

  function updateProgress(nextId) {
    if (typeof window.updateProgressBar === "function") {
      window.updateProgressBar(nextId);
      return;
    }

    var bar = one("#progress-bar");
    if (!bar) return;
    if (nextId === "last") {
      bar.style.display = "none";
      return;
    }
    var match = String(nextId).match(/^q(\d+)$/);
    if (!match) return;
    var total = 7;
    var position = Math.min(parseInt(match[1], 10), total);
    var remaining = Math.max(0, total - position);
    var fill = one(".progress-bar__fill", bar);
    var label = one(".progress-bar__label", bar);
    if (fill) fill.style.width = Math.min(100, (position / total) * 100) + "%";
    if (label) label.textContent = remaining > 0 ? "あと" + remaining + "問" : "ラスト！";
  }

  function hideOldOptions() {
    all("#chats .chat_options").forEach(function (element) {
      element.style.display = "none";
    });
  }

  function applyResultOrder() {
    var result = one("#inline-result");
    if (!result) return;
    var ranking = calculateRanking();
    var order = ranking.order;
    var cards = all(":scope > .topbox.topboxNew.case", result);
    var cardMap = {};

    cards.forEach(function (card) {
      var link = one('a[href*="redirect.html?item="]', card);
      if (!link) return;
      var match = link.getAttribute("href").match(/item=([^&#]+)/);
      if (match) cardMap[match[1]] = card;
    });

    order.forEach(function (item, index) {
      var card = cardMap[item];
      if (!card) return;
      card.hidden = false;
      card.style.display = "";
      card.classList.add("result-lpo-ready");
      card.setAttribute("data-result-rank", String(index + 1));
      card.setAttribute("data-result-flow", selectedExperience);
      card.setAttribute("data-match-score", String(ranking.matches[item]));

      all(".result-rank-label", card).forEach(function (label) { label.remove(); });
      all(".result-lpo-card", card).forEach(function (panel) { panel.remove(); });
      all('img[src*="rank1_catch"]', card).forEach(function (image) {
        var wrapper = image.parentElement;
        if (wrapper) wrapper.style.display = "none";
      });

      all("details", card).forEach(function (details) {
        details.open = true;
      });

      var panel = buildResultCard(item, index + 1, card, ranking.matches[item]);
      if (panel) card.insertBefore(panel, card.firstChild);
      result.insertBefore(card, one(".result-extra-section", result));
    });

    cards.forEach(function (card) {
      var item = productIdFromCard(card);
      if (order.indexOf(item) === -1) {
        card.hidden = true;
        card.style.display = "none";
      }
    });
  }

  function finish() {
    updateProgress("last");
    var result = one("#inline-result");
    if (result) {
      updateResultOverview();
      applyResultOrder();
      result.style.display = "block";
      setTimeout(function () {
        result.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 150);
    }
  }

  function fallbackQuestion(nextId) {
    var source = fallbackQuestions[nextId] || fallbackQuestions.last;
    var data = {
      id: source.id,
      nextId: source.nextId,
      questions: (source.questions || []).slice(),
      options: {},
      type: source.type,
    };

    Object.keys(source.options || {}).forEach(function (key) {
      data.options[key] = source.options[key];
    });

    return data;
  }

  function getQuestionData(nextId) {
    return fallbackQuestion(nextId);
  }

  function renderQuestion(nextId) {
    var chats = one("#chats");
    if (!chats) return;
    var token = ++renderToken;

    hideOldOptions();
    updateProgress(nextId);

    var data = getQuestionData(nextId);
    if (!data || !data.id) return;

    var questions = data.questions || [];
    var typing = typingBubble();
    chats.appendChild(typing);
    scrollToLatest(typing);

    questions.forEach(function (question, index) {
      setTimeout(function () {
        if (token !== renderToken) return;
        if (typing.parentNode) typing.remove();
        var message = adminBubble(question);
        chats.appendChild(message);
        if (index < questions.length - 1) {
          typing = typingBubble();
          chats.appendChild(typing);
        }
        scrollToLatest(index < questions.length - 1 ? typing : message);
      }, messageDelay * (index + 1));
    });

    if (data.type === "last") {
      setTimeout(function () {
        if (token !== renderToken) return;
        finish();
      }, messageDelay * (questions.length + 1) + optionDelay);
      return;
    }

    setTimeout(function () {
      if (token !== renderToken) return;
      var options = buildOptions(data);
      chats.appendChild(options);
      scrollToLatest(options);
    }, messageDelay * (questions.length + 1) + optionDelay);
  }

  function buildOptions(data) {
    if (data.type === "multiselect") return buildMultiOptions(data);
    if (data.type === "final") return buildSingleOptions(data);
    return buildSingleOptions(data);
  }

  function buildSingleOptions(data) {
    var wrap = document.createElement("div");
    var optionCount = Object.keys(data.options || {}).length;
    wrap.className =
      "chat_item chat_options admin_chat_options" +
      (optionCount === 2 ? " admin_chat_options--half" : " admin_chat_options--radio");

    var ul = document.createElement("ul");
    ul.className = "option_list";
    ul.setAttribute("data-itemid", data.id);

    Object.keys(data.options || {}).forEach(function (label) {
      var answerId = data.options[label];
      var li = document.createElement("li");
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option demo-option";
      button.setAttribute("data-selected", label);
      button.setAttribute("data-answer", answerId);
      button.setAttribute("data-next", data.nextId || "last");
      button.innerHTML = "<span>" + label + "</span>";
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        selectAnswer(data.id, label, answerId, data.nextId || "last");
      });
      li.appendChild(button);
      ul.appendChild(li);
    });

    wrap.appendChild(ul);
    return wrap;
  }

  function buildMultiOptions(data) {
    var wrap = document.createElement("div");
    wrap.className = "chat_item chat_options admin_chat_options admin_chat_options--multiselect";
    wrap.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    var ul = document.createElement("ul");
    ul.className = "option_list";
    ul.setAttribute("data-itemid", data.id);

    var li = document.createElement("li");
    li.className = "option";
    Object.keys(data.options || {}).forEach(function (label) {
      var answerId = data.options[label];
      var safeId = "demo-" + data.id + "-" + answerId;
      var option = document.createElement("label");
      option.className = "multi_list__item__label";
      option.innerHTML =
        '<div class="multi_list__item__label-check">' +
        '<input id="' + safeId + '" type="checkbox" data-selected="' + label + '" value="' + answerId + '">' +
        "</div>" +
        '<div class="multi_list__item__label-text">' + label + "</div>";
      li.appendChild(option);
    });
    ul.appendChild(li);
    wrap.appendChild(ul);

    var btnWrap = document.createElement("div");
    btnWrap.className = "chat_next_btn_wrap";
    var button = document.createElement("button");
    button.type = "button";
    button.className = "chat__form-btn";
    button.textContent = "次に進む";
    button.disabled = true;

    wrap.addEventListener("change", function () {
      button.disabled = all('input[type="checkbox"]:checked', wrap).length === 0;
    });

    button.addEventListener("click", function () {
      var checked = all('input[type="checkbox"]:checked', wrap);
      var selected = checked.map(function (input) { return input.getAttribute("data-selected"); }).join("、");
      var answers = checked.map(function (input) { return input.value; }).join("");
      selectAnswer(data.id, selected, answers, data.nextId || "last");
    });

    btnWrap.appendChild(button);
    wrap.appendChild(btnWrap);
    return wrap;
  }

  function selectAnswer(itemId, selected, answerId, nextId) {
    var chats = one("#chats");
    if (!chats) return;
    hideOldOptions();
    appendHidden(itemId, selected);
    appendParameter(itemId, answerId);
    var answer = userBubble(itemId, formatReply(selected));
    chats.appendChild(answer);
    scrollToLatest(answer);
    renderQuestion(nextId);
  }

  window.startDiagnosis = function (route) {
    if (started) return;
    started = true;
    selectedExperience = normalizeExperience(route);

    document.body.classList.add("green");
    document.body.classList.add("first-modal-checked");
    document.body.classList.add("diagnosis-started");
    document.body.setAttribute("data-experience", selectedExperience);
    appendHidden("diagnosis_start", selectedExperience === "experience_yes" ? "経験あり" : "はじめて");
    appendHidden("card_loan_experience", selectedExperience === "experience_yes" ? "経験あり" : "はじめて");
    hideModal();
    var chats = one("#chats");
    if (chats) {
      var answer = userBubble("card_loan_experience", formatReply(selectedExperience === "experience_yes" ? "経験あり" : "はじめて"));
      chats.appendChild(answer);
      scrollToLatest(answer);
    }
    renderQuestion("q01");
  };

  function resumeBlankStartedState() {
    var chats = one("#chats");
    if (!chats || chats.children.length > 0) return;
    if (!document.body.classList.contains("diagnosis-started")) return;
    started = true;
    hideModal();
    renderQuestion("q01");
  }

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target && event.target.nodeType === 1 ? event.target : event.target.parentElement;
      var button = target && target.closest(".first-modal__option-btn");
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.startDiagnosis(button.getAttribute("data-itemid"));
    },
    true
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", resumeBlankStartedState);
  } else {
    resumeBlankStartedState();
  }
  window.addEventListener("load", resumeBlankStartedState);
  setTimeout(resumeBlankStartedState, 500);
})();

