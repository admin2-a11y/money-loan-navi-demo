(function () {
  "use strict";

  var BOT_IMAGE = "images/money-loan-navi-bot.webp";
  var REDIRECT_PAGE = "redirect.html";
  var TRACKING_KEYS = ["ttclid", "ycid", "fbclid", "gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  var questions = {
    q00: {
      label: "利用経験",
      messages: ["これまでに利用したことがあるカードローンを教えてください。（複数選択可）"],
      type: "multi",
      options: ["アコム", "プロミス", "SMBCモビット", "アイフル", "その他・覚えていない"]
    },
    q01: {
      label: "重視点",
      messages: ["早速、診断を始めましょう！", "カードローン選びで、最も重視することを教えてください。"],
      type: "single",
      options: ["金利・無利息期間", "融資スピード", "周囲への知られにくさ", "申込みやすさ"]
    },
    q02: {
      label: "希望額",
      messages: ["いくら借りたいですか？"],
      type: "single",
      options: ["10万円以下", "11〜20万円", "21〜30万円", "31万円以上", "こだわらない"]
    },
    q03: {
      label: "希望時期",
      messages: ["いつまでに借りたいですか？"],
      type: "single",
      options: ["1時間以内", "当日中", "3日以内", "1週間以内", "こだわらない"]
    },
    q04: {
      label: "借り方",
      messages: ["どのように借りたいですか？"],
      type: "single",
      options: ["コンビニATM", "口座振込", "どちらでも"]
    },
    q05: {
      label: "年齢",
      messages: ["ありがとうございます！次はあなた自身について教えてください。", "現在の年齢を教えてください。"],
      type: "single",
      options: ["〜19歳", "20〜29歳", "30〜39歳", "40〜49歳", "50〜59歳", "60歳以上"]
    },
    q06: {
      label: "職業",
      messages: ["現在の職業を教えてください。"],
      type: "single",
      options: ["正社員", "公務員", "契約・派遣社員", "パート・アルバイト", "個人事業主・経営者", "専業主婦", "学生", "無職"]
    },
    q07: {
      label: "年収",
      messages: ["現在の年収を教えてください。"],
      type: "single",
      options: ["120万円未満", "121〜300万円", "301〜500万円", "501〜700万円", "701万円以上"]
    }
  };

  var answerCodes = {
    q00: { "アコム": "usedAcom", "プロミス": "usedPromise", "SMBCモビット": "usedMobit", "アイフル": "usedAiflu", "その他・覚えていない": "usedOther" },
    q01: { "金利・無利息期間": "priorityInterest", "融資スピード": "prioritySpeed", "周囲への知られにくさ": "priorityPrivacy", "申込みやすさ": "priorityEase" },
    q02: { "10万円以下": "a07", "11〜20万円": "a08", "21〜30万円": "a09", "31万円以上": "a10", "こだわらない": "a11" },
    q03: { "1時間以内": "a12", "当日中": "a13", "3日以内": "a14", "1週間以内": "a15", "こだわらない": "a16" },
    q04: { "コンビニATM": "a17", "口座振込": "a18", "どちらでも": "a19" },
    q05: { "〜19歳": "a26", "20〜29歳": "a27", "30〜39歳": "a28", "40〜49歳": "a43", "50〜59歳": "a44", "60歳以上": "a29" },
    q06: { "正社員": "a35", "公務員": "a36", "契約・派遣社員": "a37", "パート・アルバイト": "a38", "個人事業主・経営者": "a39", "専業主婦": "a40", "学生": "a41", "無職": "a42" },
    q07: { "120万円未満": "a30", "121〜300万円": "a31", "301〜500万円": "a32", "501〜700万円": "a33", "701万円以上": "a34" }
  };


  var state = {
    experience: "",
    sequence: [],
    index: 0,
    answers: {},
    renderToken: 0
  };

  var entryScreen = document.getElementById("entry-screen");
  var diagnosisScreen = document.getElementById("diagnosis-screen");
  var analysisScreen = document.getElementById("analysis-screen");
  var resultsScreen = document.getElementById("results-screen");
  var conversation = document.getElementById("conversation");
  var answerPanel = document.getElementById("answer-panel");

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function delay(ms) {
    return new Promise(function (resolve) { window.setTimeout(resolve, ms); });
  }

  function pushEvent(name, details) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, details || {}));
  }

  function setCompatibilityField(name, value) {
    var mount = document.getElementById("results");
    if (!mount) return;
    var input = mount.querySelector('input[name="' + name + '"]');
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      mount.appendChild(input);
    }
    input.value = value;
  }

  function appendCompatibilityParameter(questionId, answer) {
    var parameter = document.getElementById("parameter");
    if (!parameter) return;
    var codes = answerCodes[questionId] || {};
    var answerCode = String(answer).split("、").map(function (label) { return codes[label] || ""; }).join("");
    parameter.value += questionId + answerCode;
  }

  function resetCompatibilityFields() {
    var mount = document.getElementById("results");
    if (!mount) return;
    all('input:not(#parameter)', mount).forEach(function (input) { input.remove(); });
    var parameter = document.getElementById("parameter");
    if (parameter) parameter.value = "";
  }

  function syncCompatibilityFields() {
    resetCompatibilityFields();
    if (!state.experience) return;
    var experienceLabel = state.experience === "experience_yes" ? "経験あり" : "はじめて";
    setCompatibilityField("diagnosis_start", experienceLabel);
    setCompatibilityField("card_loan_experience", experienceLabel);
    state.sequence.slice(0, state.index).forEach(function (questionId) {
      var answer = state.answers[questionId];
      if (!answer) return;
      setCompatibilityField(questionId, answer);
      appendCompatibilityParameter(questionId, answer);
    });
  }

  function storeQueryParameters() {
    var params = new URLSearchParams(window.location.search);
    try {
      var stored = new URLSearchParams(window.localStorage.getItem("moneyLoanNaviQueryParams") || window.localStorage.getItem("queryParams") || "");
      params.forEach(function (value, key) {
        if (TRACKING_KEYS.indexOf(key) !== -1) stored.set(key, value);
      });
      var serialized = stored.toString();
      if (!serialized) return;
      window.localStorage.setItem("queryParams", serialized);
      window.localStorage.setItem("moneyLoanNaviQueryParams", serialized);
    } catch (error) {
      return;
    }
  }

  function setVisible(screen) {
    [entryScreen, diagnosisScreen, analysisScreen, resultsScreen].forEach(function (item) {
      item.hidden = item !== screen;
    });
  }

  function focusHeading(id, fallback) {
    var heading = document.getElementById(id);
    if (!heading) return;
    window.requestAnimationFrame(function () {
      var target = heading.getClientRects().length ? heading : fallback;
      if (target) target.focus({ preventScroll: true });
    });
  }

  function scrollToElement(element, instant) {
    if (!element) return;
    window.requestAnimationFrame(function () {
      var rect = element.getBoundingClientRect();
      var topbar = document.querySelector(".diagnosis-topbar");
      var topOffset = topbar ? topbar.getBoundingClientRect().bottom + 12 : 12;
      var availableHeight = window.innerHeight - topOffset - 18;
      if (element === answerPanel) {
        var currentQuestion = conversation.lastElementChild;
        if (currentQuestion) {
          var questionRect = currentQuestion.getBoundingClientRect();
          var questionTop = window.scrollY + questionRect.top - topOffset;
          var answerBottom = window.scrollY + rect.bottom - window.innerHeight + 28;
          var destination = rect.height > availableHeight ? questionTop : Math.min(questionTop, answerBottom);
          if (questionRect.top < topOffset || rect.bottom > window.innerHeight - 18) {
            window.scrollTo({ top: Math.max(0, destination), behavior: instant ? "auto" : "smooth" });
          }
        }
        return;
      }
      var target = window.scrollY + rect.bottom - window.innerHeight + 28;
      if (rect.top < topOffset || rect.bottom > window.innerHeight - 18) {
        window.scrollTo({ top: Math.max(0, target), behavior: instant ? "auto" : "smooth" });
      }
    });
  }

  function createAssistantMessage(text, typing) {
    var row = document.createElement("div");
    row.className = "message message--assistant";

    var avatar = document.createElement("img");
    avatar.className = "message__avatar";
    avatar.src = BOT_IMAGE;
    avatar.width = 512;
    avatar.height = 512;
    avatar.alt = "";
    avatar.setAttribute("aria-hidden", "true");

    var body = document.createElement("div");
    body.className = "message__body";
    var name = document.createElement("p");
    name.className = "message__name";
    name.textContent = "マネーローンナビ";
    var bubble = document.createElement("div");
    bubble.className = "message__bubble";

    if (typing) {
      row.setAttribute("role", "status");
      row.setAttribute("aria-label", "マネーローンナビが入力中です");
      bubble.classList.add("typing-dots");
      bubble.setAttribute("aria-hidden", "true");
      for (var index = 0; index < 3; index += 1) bubble.appendChild(document.createElement("span"));
    } else {
      bubble.textContent = text;
    }

    body.appendChild(name);
    body.appendChild(bubble);
    row.appendChild(avatar);
    row.appendChild(body);
    return row;
  }

  function createUserMessage(text) {
    var row = document.createElement("div");
    row.className = "message message--user";
    var body = document.createElement("div");
    body.className = "message__body";
    var bubble = document.createElement("p");
    bubble.className = "message__bubble";
    bubble.textContent = formatAnswer(text);
    body.appendChild(bubble);
    row.appendChild(body);
    return row;
  }

  function formatAnswer(value) {
    var text = String(value || "").trim();
    if (!text || /(です|ます|ません)$/.test(text)) return text;
    return text + "です";
  }

  function updateProgress() {
    var total = state.sequence.length;
    var current = Math.min(state.index + 1, total);
    var remaining = Math.max(0, total - current);
    document.getElementById("progress-step").textContent = current + " / " + total;
    document.getElementById("progress-remaining").textContent = remaining ? "あと" + remaining + "問" : "ラスト";
    document.getElementById("progress-fill").style.width = (current / total * 100) + "%";
  }

  function renderCompletedConversation() {
    conversation.replaceChildren();
    conversation.appendChild(createUserMessage(state.experience === "experience_yes" ? "経験あり" : "はじめて"));
    state.sequence.slice(0, state.index).forEach(function (questionId) {
      var question = questions[questionId];
      question.messages.forEach(function (message) {
        conversation.appendChild(createAssistantMessage(message, false));
      });
      conversation.appendChild(createUserMessage(state.answers[questionId]));
    });
  }

  async function renderQuestion(options) {
    var fast = options && options.fast;
    var token = ++state.renderToken;
    updateProgress();
    answerPanel.replaceChildren();

    var questionId = state.sequence[state.index];
    var question = questions[questionId];
    if (!question) {
      await showAnalysis();
      return;
    }

    for (var index = 0; index < question.messages.length; index += 1) {
      if (token !== state.renderToken) return;
      var typing = createAssistantMessage("", true);
      conversation.appendChild(typing);
      scrollToElement(typing, fast);
      await delay(fast ? 60 : (index === 0 ? 520 : 300));
      if (token !== state.renderToken) return;
      var message = createAssistantMessage(question.messages[index], false);
      typing.replaceWith(message);
      scrollToElement(message, fast);
      if (!fast && index < question.messages.length - 1) await delay(170);
    }

    await delay(fast ? 20 : 100);
    if (token !== state.renderToken) return;
    renderAnswerPanel(questionId, question);
    scrollToElement(answerPanel, fast);
  }

  function renderAnswerPanel(questionId, question) {
    var fieldset = document.createElement("fieldset");
    fieldset.className = "choice-fieldset";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = question.messages[question.messages.length - 1];
    fieldset.appendChild(legend);

    var grid = document.createElement("div");
    grid.className = "choice-grid";

    if (question.type === "multi") {
      question.options.forEach(function (label, index) {
        var choice = document.createElement("label");
        choice.className = "multi-choice";
        var input = document.createElement("input");
        input.type = "checkbox";
        input.value = label;
        input.id = "multi-" + questionId + "-" + index;
        var text = document.createElement("span");
        text.textContent = label;
        choice.appendChild(input);
        choice.appendChild(text);
        grid.appendChild(choice);
      });
    } else {
      question.options.forEach(function (label) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "choice-button";
        button.textContent = label;
        button.addEventListener("click", function () { submitAnswer(questionId, label); });
        grid.appendChild(button);
      });
    }

    fieldset.appendChild(grid);
    answerPanel.appendChild(fieldset);
    var actions = document.createElement("div");
    actions.className = "answer-actions";

    var back = document.createElement("button");
    back.type = "button";
    back.className = "secondary-button";
    back.textContent = state.index > 0 ? "ひとつ前へ" : "利用状況を変更";
    back.addEventListener("click", state.index > 0 ? goBack : restartDiagnosis);
    actions.appendChild(back);

    if (question.type === "multi") {
      var next = document.createElement("button");
      next.type = "button";
      next.className = "primary-button";
      next.textContent = "次に進む";
      next.disabled = true;
      grid.addEventListener("change", function (event) {
        var changed = event.target;
        if (changed && changed.matches('input[type="checkbox"]') && changed.checked) {
          all('input[type="checkbox"]', grid).forEach(function (input) {
            if (changed.value === "その他・覚えていない" && input !== changed) input.checked = false;
            if (changed.value !== "その他・覚えていない" && input.value === "その他・覚えていない") input.checked = false;
          });
        }
        next.disabled = all('input[type="checkbox"]:checked', grid).length === 0;
      });
      next.addEventListener("click", function () {
        var selected = all('input[type="checkbox"]:checked', grid).map(function (input) { return input.value; });
        submitAnswer(questionId, selected.join("、"));
      });
      actions.appendChild(next);
    }

    if (actions.children.length) answerPanel.appendChild(actions);
  }

  function submitAnswer(questionId, answer) {
    if (!answer) return;
    all("button, input", answerPanel).forEach(function (control) { control.disabled = true; });
    state.answers[questionId] = answer;
    setCompatibilityField(questionId, answer);
    appendCompatibilityParameter(questionId, answer);
    conversation.appendChild(createUserMessage(answer));
    pushEvent("diagnosis_answer", { question_id: questionId, answer: answer });
    answerPanel.replaceChildren();
    state.index += 1;
    if (state.index >= state.sequence.length) {
      window.setTimeout(showAnalysis, 180);
      return;
    }
    renderQuestion({ fast: false });
  }

  function goBack() {
    if (state.index <= 0) return;
    state.renderToken += 1;
    state.index -= 1;
    delete state.answers[state.sequence[state.index]];
    syncCompatibilityFields();
    renderCompletedConversation();
    renderQuestion({ fast: true });
  }

  function startDiagnosis(experience) {
    state.experience = experience === "experience_yes" ? "experience_yes" : "experience_no";
    document.body.classList.toggle("beginner", state.experience === "experience_no");
    state.sequence = state.experience === "experience_yes"
      ? ["q00", "q01", "q02", "q03", "q04", "q05", "q06", "q07"]
      : ["q01", "q02", "q03", "q04", "q05", "q06", "q07"];
    state.index = 0;
    state.answers = {};
    state.renderToken += 1;
    syncCompatibilityFields();
    setVisible(diagnosisScreen);
    focusHeading("diagnosis-title", diagnosisScreen);
    renderCompletedConversation();
    pushEvent("diagnosis_start", { experience: state.experience });
    window.scrollTo({ top: 0, behavior: "auto" });
    renderQuestion({ fast: false });
  }

  async function showAnalysis() {
    state.renderToken += 1;
    setVisible(analysisScreen);
    focusHeading("analysis-title");
    window.scrollTo({ top: 0, behavior: "smooth" });
    var fill = document.getElementById("analysis-fill");
    var status = document.getElementById("analysis-status");
    var stages = [
      [28, "ご希望条件を整理しています"],
      [56, "サービスの特徴を比較しています"],
      [82, "条件に近い候補を選定しています"],
      [100, "比較が完了しました"]
    ];
    for (var index = 0; index < stages.length; index += 1) {
      fill.style.width = stages[index][0] + "%";
      status.textContent = stages[index][1];
      await delay(index === stages.length - 1 ? 420 : 720);
    }
    renderResults();
  }


  function renderResults() {
    setVisible(resultsScreen);
    focusHeading("ranking-title");
    window.scrollTo({ top: 0, behavior: "smooth" });
    pushEvent("diagnosis_complete", { ranking: "acom,promise,mobit" });
  }

  function restartDiagnosis() {
    state.renderToken += 1;
    state.experience = "";
    state.sequence = [];
    state.index = 0;
    state.answers = {};
    document.body.classList.remove("beginner");
    resetCompatibilityFields();
    conversation.replaceChildren();
    answerPanel.replaceChildren();
    setVisible(entryScreen);
    focusHeading("entry-title", entryScreen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  all("[data-experience]").forEach(function (button) {
    button.addEventListener("click", function () {
      startDiagnosis(button.getAttribute("data-experience"));
    });
  });

  storeQueryParameters();
  if (new URLSearchParams(window.location.search).get("view") === "results") {
    setVisible(resultsScreen);
    focusHeading("ranking-title");
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}());
