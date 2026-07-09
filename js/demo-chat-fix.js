(function () {
  var started = false;
  var selectedExperience = "experience_no";
  var renderToken = 0;
  var messageDelay = 1050;
  var optionDelay = 650;
  var resultOrders = {
    experience_yes: ["mobit", "aiflu", "acom"],
    experience_no: ["promise", "mobit", "acom"],
  };
  var fallbackQuestions = {
    q01: {
      id: "q01",
      nextId: "q02",
      questions: [
        "こんにちは、マネーローンナビです。ご利用状況に合わせて候補を整理します。",
        "まず、年齢を教えてください。",
      ],
      options: {
        "20〜29歳": "age20",
        "30〜39歳": "age30",
        "40〜49歳": "age40",
        "50〜59歳": "age50",
        "60歳以上": "age60",
      },
      type: "radio",
    },
    q02: {
      id: "q02",
      nextId: "q03",
      questions: ["職業を教えてください。"],
      options: {
        "会社員": "jobEmployee",
        "公務員": "jobPublic",
        "自営業": "jobSelf",
        "パート・アルバイト": "jobPart",
        "主婦・主夫": "jobHousehold",
        "学生": "jobStudent",
        "その他": "jobOther",
      },
      type: "radio",
    },
    q03: {
      id: "q03",
      nextId: "q04",
      questions: ["本人の年収に近いものを選んでください。"],
      options: {
        "100万円未満": "incomeUnder100",
        "100〜199万円": "income100",
        "200〜299万円": "income200",
        "300〜499万円": "income300",
        "500万円以上": "income500",
      },
      type: "radio",
    },
    q04: {
      id: "q04",
      nextId: "q05",
      questions: ["他社借入金額に近いものを選んでください。"],
      options: {
        "なし": "debtNone",
        "1〜49万円": "debt1",
        "50〜99万円": "debt50",
        "100万円以上": "debt100",
      },
      type: "radio",
    },
    q05: {
      id: "q05",
      nextId: "q06",
      questions: ["希望借入額に近いものを選んでください。"],
      options: {
        "5万円以下": "amount5",
        "10万円前後": "amount10",
        "30万円前後": "amount30",
        "50万円以上": "amount50",
      },
      type: "radio",
    },
    q06: {
      id: "q06",
      nextId: "last",
      questions: ["希望スピードを教えてください。"],
      options: {
        "今日中": "speedToday",
        "近日中": "speedSoon",
        "急がない": "speedLater",
      },
      type: "final",
    },
    last: {
      id: "last",
      questions: ["ご希望条件に近いサービスを確認しています。"],
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

  function hideModal() {
    all(".select_modal, .select_modal_body").forEach(function (element) {
      element.classList.remove("active");
      element.style.display = "none";
    });
  }

  function scrollToLatest() {
    setTimeout(function () {
      var chats = one("#chats");
      if (chats) chats.scrollIntoView({ block: "end", behavior: "smooth" });
    }, 50);
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
      '<div class="chat_admin_name">女性ナビゲーター</div>' +
      '<div class="chat_admin_text"><span>' + text + "</span></div>" +
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
    var total = 6;
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
    var order = resultOrders[selectedExperience] || resultOrders.experience_no;
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
      card.setAttribute("data-result-rank", String(index + 1));
      card.setAttribute("data-result-flow", selectedExperience);

      all(".result-rank-label", card).forEach(function (label) { label.remove(); });
      all('img[src*="rank1_catch"]', card).forEach(function (image) {
        var wrapper = image.parentElement;
        if (wrapper) wrapper.style.display = "none";
      });

      var label = document.createElement("div");
      label.className = "result-rank-label";
      label.textContent = (index + 1) + "位";
      card.insertBefore(label, card.firstChild);
      result.insertBefore(card, result.querySelector("section"));
    });

    cards.forEach(function (card) {
      var link = one('a[href*="redirect.html?item="]', card);
      var href = link ? link.getAttribute("href") : "";
      var matched = href.match(/item=([^&#]+)/);
      var item = matched && matched[1];
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
    questions.forEach(function (question, index) {
      setTimeout(function () {
        if (token !== renderToken) return;
        chats.appendChild(adminBubble(question));
        scrollToLatest();
      }, messageDelay * (index + 1));
    });

    if (data.type === "last") {
      setTimeout(function () {
        if (token !== renderToken) return;
        finish();
        scrollToLatest();
      }, messageDelay * (questions.length + 1) + optionDelay);
      return;
    }

    setTimeout(function () {
      if (token !== renderToken) return;
      chats.appendChild(buildOptions(data));
      scrollToLatest();
    }, messageDelay * (questions.length + 1) + optionDelay);
  }

  function buildOptions(data) {
    if (data.type === "multiselect") return buildMultiOptions(data);
    if (data.type === "final") return buildFinalOptions(data);
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

  function buildFinalOptions(data) {
    var wrap = document.createElement("div");
    var optionCount = Object.keys(data.options || {}).length;
    wrap.className =
      "chat_item chat_options admin_chat_options" +
      (optionCount === 2 ? " admin_chat_options--half" : " admin_chat_options--radio");

    var ul = document.createElement("ul");
    ul.className = "option_list";
    ul.setAttribute("data-itemid", data.id);

    var submit = document.createElement("button");
    submit.type = "button";
    submit.className = "chat__form-btn";
    submit.textContent = "この条件で診断結果を見る";
    submit.disabled = true;

    var selected = null;
    Object.keys(data.options || {}).forEach(function (label) {
      var answerId = data.options[label];
      var li = document.createElement("li");
      var option = document.createElement("button");
      option.type = "button";
      option.className = "option demo-option";
      option.setAttribute("data-selected", label);
      option.setAttribute("data-answer", answerId);
      option.innerHTML = "<span>" + label + "</span>";
      option.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        selected = {
          label: option.getAttribute("data-selected"),
          answer: option.getAttribute("data-answer"),
        };
        all(".demo-option", wrap).forEach(function (item) {
          item.classList.remove("is-selected");
        });
        option.classList.add("is-selected");
        submit.disabled = false;
      });
      li.appendChild(option);
      ul.appendChild(li);
    });

    wrap.appendChild(ul);

    var btnWrap = document.createElement("div");
    btnWrap.className = "chat_next_btn_wrap";
    btnWrap.appendChild(submit);
    wrap.appendChild(btnWrap);

    submit.addEventListener("click", function () {
      if (!selected) return;
      selectAnswer(data.id, selected.label, selected.answer, data.nextId || "last");
    });
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
    chats.appendChild(userBubble(itemId, formatReply(selected)));
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
      chats.appendChild(userBubble("card_loan_experience", formatReply(selectedExperience === "experience_yes" ? "経験あり" : "はじめて")));
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

