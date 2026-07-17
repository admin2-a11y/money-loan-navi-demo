(() => {
  "use strict";

  const entry = document.getElementById("entry");
  const diagnosis = document.getElementById("diagnosis");
  const results = document.getElementById("results");
  const conversation = document.getElementById("conversation");
  const questionPanel = document.getElementById("question-panel");
  const progressStep = document.getElementById("progress-step");
  const progressLabel = document.getElementById("progress-label");
  const progressFill = document.getElementById("progress-fill");
  const dataForm = document.getElementById("diagnosis-data");
  const parameterInput = document.getElementById("parameter");
  const summaryList = document.getElementById("answer-summary-list");
  const lenderList = document.getElementById("lender-list");
  const finalLender = document.getElementById("final-lender");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const messageDelay = reduceMotion ? 0 : 520;
  const betweenMessages = reduceMotion ? 0 : 380;
  const optionDelay = reduceMotion ? 0 : 120;

  const questions = {
    q00: {
      id: "q00",
      summary: "利用経験",
      nextId: "q01",
      messages: ["これまでに利用したことがあるカードローンを教えてください。（複数選択可）"],
      options: {
        "アコム": "usedAcom",
        "プロミス": "usedPromise",
        "SMBCモビット": "usedMobit",
        "アイフル": "usedAiflu",
        "その他・覚えていない": "usedOther"
      },
      type: "multiselect"
    },
    q01: {
      id: "q01",
      summary: "重視点",
      nextId: "q02",
      messages: [
        "早速、診断を始めましょう！",
        "カードローン選びで、最も重視することを教えてください。"
      ],
      options: {
        "金利・無利息期間": "priorityInterest",
        "融資スピード": "prioritySpeed",
        "周囲への知られにくさ": "priorityPrivacy",
        "申込みやすさ": "priorityEase"
      },
      type: "single"
    },
    q02: {
      id: "q02",
      summary: "希望額",
      nextId: "q03",
      messages: ["いくら借りたいですか？"],
      options: {
        "10万円以下": "a07",
        "11〜20万円": "a08",
        "21〜30万円": "a09",
        "31万円以上": "a10",
        "こだわらない": "a11"
      },
      type: "single"
    },
    q03: {
      id: "q03",
      summary: "希望時期",
      nextId: "q04",
      messages: ["いつまでに借りたいですか？"],
      options: {
        "1時間以内": "a12",
        "当日中": "a13",
        "3日以内": "a14",
        "1週間以内": "a15",
        "こだわらない": "a16"
      },
      type: "single"
    },
    q04: {
      id: "q04",
      summary: "借り方",
      nextId: "q05",
      messages: ["どのように借りたいですか？"],
      options: {
        "コンビニATM": "a17",
        "口座振込": "a18",
        "どちらでも": "a19"
      },
      type: "single"
    },
    q05: {
      id: "q05",
      summary: "年齢",
      nextId: "q06",
      messages: [
        "ありがとうございます！次はあなた自身について教えてください。",
        "現在の年齢を教えてください。"
      ],
      options: {
        "〜19歳": "a26",
        "20〜29歳": "a27",
        "30〜39歳": "a28",
        "40〜49歳": "a43",
        "50〜59歳": "a44",
        "60歳以上": "a29"
      },
      type: "single",
      compact: true
    },
    q06: {
      id: "q06",
      summary: "職業",
      nextId: "q07",
      messages: ["現在の職業を教えてください。"],
      options: {
        "正社員": "a35",
        "公務員": "a36",
        "契約・派遣社員": "a37",
        "パート・アルバイト": "a38",
        "個人事業主・経営者": "a39",
        "専業主婦": "a40",
        "学生": "a41",
        "無職": "a42"
      },
      type: "single",
      compact: true
    },
    q07: {
      id: "q07",
      summary: "年収",
      nextId: "complete",
      messages: ["現在の年収を教えてください。"],
      options: {
        "120万円未満": "a30",
        "121〜300万円": "a31",
        "301〜500万円": "a32",
        "501〜700万円": "a33",
        "701万円以上": "a34"
      },
      type: "single"
    }
  };

  const lenders = [
    {
      key: "mobit",
      name: "SMBCモビット",
      group: "三井住友カード株式会社",
      banner: "banner_mobit.jpg",
      bannerWidth: 480,
      bannerHeight: 400,
      catch: "10秒簡易審査ですぐ結果がわかる！",
      cta: "10秒簡易審査を試す",
      specs: [["融資時間", "最短15分"], ["実質年率", "3.0％～18.0％"], ["利用限度額", "最大800万円"], ["事前審査", "10秒簡易審査"], ["利用方法", "振込・コンビニATM"]],
      points: [["お申込みから最短15分で審査完了！", "お申し込みから最短15分で審査するから急な出費にも即対応！"], ["振込は最短3分", "ご契約後、最短3分で口座へ振り込まれる！"], ["原則電話連絡・郵送物なし", "面倒な電話連絡や郵送物はないから誰にもバレなくて安心！"], ["返済でVポイントが貯まる・使える", "返済の利息分でVポイントが貯まるからお得！"]],
      review: "事前に身分証明書を準備して申し込み。審査もスムーズに進みました！すべてスマホで完結できたので、誰にもバレずにすぐ着金。もっと早く利用すれば良かったです！",
      reviewImage: "review-mobit-v2.png",
      reviewWidth: 172,
      reviewHeight: 185,
      note: "※お申込の曜日、時間帯によっては翌日以降の取扱となる場合があります。※原則電話連絡なし。（WEB完結申込の場合）※口座への入金が完了する日時は金融機関によって異なります。※サービス内容は公式サイトで最新情報をご確認ください。※一例であり、結果を保証するものではありません。"
    },
    {
      key: "aiflu",
      name: "アイフル",
      group: "アイフル株式会社",
      banner: "banner_aiful.jpg",
      bannerWidth: 300,
      bannerHeight: 250,
      catch: "最短14分※1融資・1秒で事前診断",
      cta: "1秒診断で借り入れ可能か確認する",
      specs: [["融資時間", "最短14分※1"], ["実質年率", "3.0％～18.0％"], ["利用限度額", "最大800万円"], ["無利息期間", "初めての方なら最大30日間"], ["事前診断", "1秒診断"]],
      points: [["今日借りられる！申込みから融資まで最短14分※1", "Webから24時間365日申し込み可！すぐ振り込みしてもらえる！"], ["無利息で借りられる期間あり！", "はじめてなら最大30日間利息0円。"], ["原則、勤務先への電話連絡なし", "申込みから借入・返済までWebで完結できるので家族や職場にバレない。"], ["1秒診断で借入可能性を確認", "年齢・年収・他社借入金額などから簡易的に確認できます。"]],
      review: "急な出費があり、初めてカードローンを利用しました。短期間で返済する予定だったため、30日間の無利息サービスを利用できた点に満足しています。",
      reviewImage: "review-aiful-v2.png",
      reviewWidth: 181,
      reviewHeight: 192,
      note: "※1お申込時間や審査状況によりご希望に添えない場合があります。※サービス内容は公式サイトで最新情報をご確認ください。※一例であり、結果を保証するものではありません。"
    },
    {
      key: "promise",
      name: "プロミス",
      group: "SMBCコンシューマーファイナンス株式会社",
      banner: "banner_promise.jpg",
      bannerWidth: 320,
      bannerHeight: 250,
      catch: "Webなら最短3分で融資可能",
      cta: "1秒パパッと診断を試す",
      specs: [["融資時間", "最短3分"], ["実質年率", "2.5％～18.0％"], ["利用限度額", "最大800万円"], ["無利息期間", "初回借入の翌日から30日間"], ["事前診断", "1秒パパッと診断"]],
      points: [["即日可能！最短3分で審査完了！", "21時までの申込みで即日融資可能！"], ["30日間無利息もありお得に借りれる！", "初回借入の翌日から30日間、条件を満たす方は無利息で利用できます。"], ["1秒パパっと診断", "借り入れ可能かすぐチェックできる！"]],
      review: "スマホで完結できるので審査から借入までがとにかく早い。誰にもバレずに借りることが出来ました。返済も月1000円からで良いのも助かってます。",
      reviewImage: "review-promise-v2.png",
      reviewWidth: 194,
      reviewHeight: 190,
      note: "※無利息期間の適用にはメールアドレス登録とWeb明細利用の登録が必要です。※お申込時間や審査状況によりご希望に添えない場合があります。※サービス内容は公式サイトで最新情報をご確認ください。※一例であり、結果を保証するものではありません。"
    }
  ];

  const state = {
    experience: null,
    answers: new Map(),
    currentId: null,
    renderToken: 0
  };

  function wait(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  function formatReply(value) {
    const text = String(value).trim();
    return /(です|ます|ません)$/.test(text) ? text : `${text}です`;
  }

  function scrollToLatest(element) {
    if (!element) return;
    window.requestAnimationFrame(() => {
      element.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  function createAssistantTurn(message, typing = false) {
    const turn = document.createElement("div");
    turn.className = "turn turn--assistant";

    const avatar = document.createElement("img");
    avatar.className = "turn__avatar";
    avatar.src = "images/money-loan-navi-bot.webp";
    avatar.width = 512;
    avatar.height = 512;
    avatar.alt = "";

    const body = document.createElement("div");
    body.className = "turn__body";
    const name = document.createElement("p");
    name.className = "turn__name";
    name.textContent = "マネーローンナビ";
    body.appendChild(name);

    if (typing) {
      const indicator = document.createElement("div");
      indicator.className = "typing";
      indicator.setAttribute("role", "status");
      indicator.setAttribute("aria-label", "マネーローンナビが入力中です");
      indicator.innerHTML = "<i></i><i></i><i></i>";
      body.appendChild(indicator);
    } else {
      const text = document.createElement("p");
      text.className = "turn__message";
      text.textContent = message;
      body.appendChild(text);
    }

    turn.append(avatar, body);
    return turn;
  }

  function createAnswerTurn(id, value, canModify = true) {
    const turn = document.createElement("div");
    turn.className = "turn turn--answer";
    turn.dataset.answerId = id;
    const card = document.createElement("div");
    card.className = "answer-card";
    const text = document.createElement("p");
    text.textContent = formatReply(value);
    card.appendChild(text);

    if (canModify) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.modify = id;
      button.textContent = "訂正する";
      card.appendChild(button);
    }

    turn.appendChild(card);
    return turn;
  }

  function completedQuestionIds() {
    return Array.from(state.answers.keys());
  }

  function getTotalQuestions() {
    return state.experience === "experience_yes" ? 8 : 7;
  }

  function getQuestionPosition(id) {
    if (id === "q00") return 1;
    const numeric = Number(id.slice(1));
    return state.experience === "experience_yes" ? numeric + 1 : numeric;
  }

  function updateProgress(id) {
    const total = getTotalQuestions();
    const position = Math.max(1, Math.min(total, getQuestionPosition(id)));
    const remaining = Math.max(0, total - position);
    progressStep.textContent = `${position} / ${total}`;
    progressLabel.textContent = remaining > 0 ? `あと${remaining}問` : "ラスト！";
    progressFill.style.width = `${(position / total) * 100}%`;
  }

  function syncDataForm() {
    dataForm.querySelectorAll("input[data-answer]").forEach((input) => input.remove());
    const fields = [
      ["diagnosis_start", state.experience === "experience_yes" ? "経験あり" : "はじめて"],
      ["card_loan_experience", state.experience === "experience_yes" ? "経験あり" : "はじめて"]
    ];
    state.answers.forEach((answer, id) => fields.push([id, answer.label]));
    fields.forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      input.dataset.answer = "true";
      dataForm.appendChild(input);
    });
    parameterInput.value = Array.from(state.answers.entries()).map(([id, answer]) => `${id}${answer.code}`).join("");
  }

  function rebuildConversation() {
    conversation.replaceChildren();
    const experienceText = state.experience === "experience_yes" ? "経験あり" : "はじめて";
    conversation.appendChild(createAnswerTurn("card_loan_experience", experienceText, false));
    state.answers.forEach((answer, id) => {
      questions[id].messages.forEach((message) => conversation.appendChild(createAssistantTurn(message)));
      conversation.appendChild(createAnswerTurn(id, answer.label));
    });
  }

  function buildSingleOptions(question) {
    const grid = document.createElement("div");
    grid.className = `option-grid${question.compact ? " option-grid--compact" : ""}`;
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", question.messages[question.messages.length - 1]);

    Object.entries(question.options).forEach(([label, code]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      button.textContent = label;
      button.addEventListener("click", () => saveAnswer(question, label, code));
      grid.appendChild(button);
    });
    return grid;
  }

  function buildMultiOptions(question) {
    const fragment = document.createDocumentFragment();
    const grid = document.createElement("div");
    grid.className = "option-grid";
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", question.messages[0]);

    Object.entries(question.options).forEach(([label, code]) => {
      const option = document.createElement("label");
      option.className = "check-option";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = code;
      input.dataset.label = label;
      const text = document.createElement("span");
      text.textContent = label;
      option.append(input, text);
      grid.appendChild(option);
    });

    const actions = document.createElement("div");
    actions.className = "panel-actions";
    const next = document.createElement("button");
    next.type = "button";
    next.className = "primary-button";
    next.textContent = "次に進む";
    next.disabled = true;
    grid.addEventListener("change", () => {
      next.disabled = grid.querySelectorAll("input:checked").length === 0;
    });
    next.addEventListener("click", () => {
      const checked = Array.from(grid.querySelectorAll("input:checked"));
      saveAnswer(question, checked.map((input) => input.dataset.label).join("、"), checked.map((input) => input.value).join(""));
    });
    actions.appendChild(next);
    fragment.append(grid, actions);
    return fragment;
  }

  async function renderQuestion(id) {
    const question = questions[id];
    if (!question) return;
    state.currentId = id;
    const token = ++state.renderToken;
    updateProgress(id);
    questionPanel.replaceChildren();

    let typing = createAssistantTurn("", true);
    conversation.appendChild(typing);
    scrollToLatest(typing);
    await wait(messageDelay);

    for (let index = 0; index < question.messages.length; index += 1) {
      if (token !== state.renderToken) return;
      typing.remove();
      const message = createAssistantTurn(question.messages[index]);
      conversation.appendChild(message);
      scrollToLatest(message);
      if (index < question.messages.length - 1) {
        typing = createAssistantTurn("", true);
        conversation.appendChild(typing);
        await wait(betweenMessages);
      }
    }

    await wait(optionDelay);
    if (token !== state.renderToken) return;
    const options = question.type === "multiselect" ? buildMultiOptions(question) : buildSingleOptions(question);
    questionPanel.appendChild(options);
    scrollToLatest(questionPanel);
  }

  function saveAnswer(question, label, code) {
    state.answers.set(question.id, { label, code });
    syncDataForm();
    questionPanel.replaceChildren();
    conversation.appendChild(createAnswerTurn(question.id, label));
    if (question.nextId === "complete") {
      completeDiagnosis();
      return;
    }
    renderQuestion(question.nextId);
  }

  function reviseAnswer(id) {
    if (!questions[id]) return;
    const keys = completedQuestionIds();
    const start = keys.indexOf(id);
    if (start < 0) return;
    keys.slice(start).forEach((key) => state.answers.delete(key));
    state.renderToken += 1;
    syncDataForm();
    rebuildConversation();
    renderQuestion(id);
  }

  function createAnalysisTurn() {
    const turn = createAssistantTurn("");
    const body = turn.querySelector(".turn__body");
    const message = turn.querySelector(".turn__message");
    message.remove();
    const card = document.createElement("div");
    card.className = "analysis-card";
    card.innerHTML = "<strong>いただいた内容をもとに、最適なカードローンを分析中です…</strong><div class=\"analysis-card__track\"><i></i></div><span>ご希望条件を整理しています…</span>";
    body.appendChild(card);
    return turn;
  }

  async function completeDiagnosis() {
    state.currentId = null;
    progressStep.textContent = `${getTotalQuestions()} / ${getTotalQuestions()}`;
    progressLabel.textContent = "回答完了";
    progressFill.style.width = "100%";

    const finalMessage = createAssistantTurn("ご回答頂いた情報からあなたにおすすめのカードローンをご紹介いたします！");
    conversation.appendChild(finalMessage);
    scrollToLatest(finalMessage);
    await wait(reduceMotion ? 0 : 350);

    const analysis = createAnalysisTurn();
    conversation.appendChild(analysis);
    const track = analysis.querySelector(".analysis-card__track i");
    const status = analysis.querySelector(".analysis-card span");
    scrollToLatest(analysis);

    const stages = [
      ["サービスの特徴を比較しています…", "50%"],
      ["条件に近い候補を選定しています…", "75%"],
      ["分析が完了しました。", "100%"]
    ];
    for (const [label, width] of stages) {
      await wait(reduceMotion ? 0 : 680);
      status.textContent = label;
      track.style.width = width;
      scrollToLatest(analysis);
    }
    await wait(reduceMotion ? 0 : 320);
    showResults();
  }

  function renderSummary() {
    summaryList.replaceChildren();
    const items = [["利用状況", state.experience === "experience_yes" ? "経験あり" : "はじめて"]];
    state.answers.forEach((answer, id) => items.push([questions[id].summary, answer.label]));
    items.forEach(([term, value]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = term;
      dd.textContent = value;
      row.append(dt, dd);
      summaryList.appendChild(row);
    });
  }

  function createLenderCard(lender, rankLabel) {
    const article = document.createElement("article");
    article.className = "lender-card";
    article.dataset.lender = lender.key;
    const specs = lender.specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
    const points = lender.points.map(([title, body]) => `<li><strong>${title}</strong><span>${body}</span></li>`).join("");
    const destination = `redirect.html?item=${lender.key}`;

    article.innerHTML = `
      <header class="lender-card__top">
        <h3><a href="${destination}" target="_blank" rel="sponsored noopener">${lender.name}</a></h3>
        <span class="rank-badge">${rankLabel}</span>
      </header>
      <p class="lender-card__catch">${lender.catch}</p>
      <div class="lender-card__body">
        <a class="lender-card__banner" href="${destination}" target="_blank" rel="sponsored noopener">
          <img src="images/${lender.banner}" width="${lender.bannerWidth}" height="${lender.bannerHeight}" alt="${lender.name}公式サイトへ" loading="lazy" decoding="async">
        </a>
        <dl class="spec-grid">
          ${specs}
          <div class="spec-grid__wide"><dt>利用コンビニ</dt><dd><img src="images/convenience-store-logos-360.webp" width="360" height="87" alt="利用可能な提携コンビニATM" loading="lazy" decoding="async"></dd></div>
        </dl>
      </div>
      <details class="lender-details">
        <summary>おすすめポイントを確認</summary>
        <ul class="lender-points">${points}</ul>
      </details>
      <section class="review-panel" aria-label="利用者の口コミ例">
        <img src="images/${lender.reviewImage}" width="${lender.reviewWidth}" height="${lender.reviewHeight}" alt="口コミ利用者" loading="lazy" decoding="async">
        <div><h4>口コミ例</h4><p>${lender.review}</p></div>
      </section>
      <div class="lender-card__action">
        <p class="lender-deadline">本日中に借りる場合 <strong data-countdown>残り時間を計算中</strong></p>
        <a class="lender-cta" href="${destination}" target="_blank" rel="sponsored noopener">${lender.cta}</a>
        <p class="lender-note">【PR】Sponsored by ${lender.group}<br>${lender.note}</p>
      </div>`;
    return article;
  }

  function updateCountdowns() {
    const now = new Date();
    const deadline = new Date(now);
    deadline.setHours(21, 0, 0, 0);
    const remaining = deadline.getTime() - now.getTime();
    document.querySelectorAll("[data-countdown]").forEach((element) => {
      if (remaining <= 0) {
        element.textContent = "本日のお申し込みを受付中";
        return;
      }
      const seconds = Math.floor(remaining / 1000);
      const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
      const secs = String(seconds % 60).padStart(2, "0");
      element.textContent = `残り ${hours}時間 ${minutes}分 ${secs}秒`;
    });
  }

  function renderLenders() {
    lenderList.replaceChildren();
    lenders.forEach((lender, index) => lenderList.appendChild(createLenderCard(lender, `おすすめ順 No.${index + 1}`)));
    finalLender.replaceChildren(createLenderCard(lenders[0], "当サイトおすすめ"));
    updateCountdowns();
  }

  function showResults() {
    renderSummary();
    renderLenders();
    diagnosis.hidden = true;
    results.hidden = false;
    results.focus?.();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function startDiagnosis(experience) {
    state.experience = experience === "experience_yes" ? "experience_yes" : "experience_no";
    state.answers.clear();
    state.renderToken += 1;
    syncDataForm();
    entry.hidden = true;
    results.hidden = true;
    diagnosis.hidden = false;
    rebuildConversation();
    renderQuestion(state.experience === "experience_yes" ? "q00" : "q01");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function restartDiagnosis() {
    state.experience = null;
    state.answers.clear();
    state.currentId = null;
    state.renderToken += 1;
    conversation.replaceChildren();
    questionPanel.replaceChildren();
    results.hidden = true;
    diagnosis.hidden = true;
    entry.hidden = false;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function storeTrackingParameters() {
    const allowed = new Set(["ttclid", "ycid", "fbclid", "gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]);
    const stored = new URLSearchParams(localStorage.getItem("queryParams") || "");
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (allowed.has(key)) stored.set(key, value);
    });
    if (stored.toString()) localStorage.setItem("queryParams", stored.toString());
  }

  document.querySelectorAll("[data-experience]").forEach((button) => {
    button.addEventListener("click", () => startDiagnosis(button.dataset.experience));
  });

  conversation.addEventListener("click", (event) => {
    const button = event.target.closest("[data-modify]");
    if (button) reviseAnswer(button.dataset.modify);
  });

  document.getElementById("restart-diagnosis").addEventListener("click", restartDiagnosis);
  window.setInterval(updateCountdowns, 1000);
  storeTrackingParameters();
})();
