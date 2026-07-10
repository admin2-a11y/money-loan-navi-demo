
function getAjaxPath() {
  if (location.host == "localhost") {
    var ajaxPath = "command";
  } else {
    var ajaxPath =
      location.protocol + "//" + location.host + location.pathname + "command";
  }

  return ajaxPath;
}

$(window).on("load", function () {
  h = $(window).height();
  $("#modal-first").css("min-height", h + "px");
});

$(window).resize(function () {
  h = $(window).height();
  $("#modal-first").css("min-height", h + "px");
});

$(function () {

  get_params("ad");
  get_params("type");

  function get_params(paraName) {
    paraValue = paraGety(paraName);

    if (paraValue != "") {
      let inputHtml =
        '<input type="text" name="' + paraName + '" value="' + paraValue + '">';
      $("#results").append(inputHtml);
      return true;
    }
return false;
  }

  function paraGety(para) {
    var pageURL = location.search.substring(1),
      urlValue = pageURL.split("&"),
      paraName;
    for (var i = 0; i < urlValue.length; i++) {
      paraName = urlValue[i].split("=");
      if (paraName[0] === para) {
return paraName[1] === undefined
          ? true
          : decodeURIComponent(paraName[1]);
      }
    }
  }
  let popAppend = false;
  var restraint_bar = false;
  let hash = location.hash;
  if (hash != "#back") {
    history.pushState(null, null, location.href);
  }
  var onBeforeunloadHandler = function (e) {
    e.returnValue = "入力途中です。本当に移動しますか？";
  };
  $(".modal_close").on("click", function () {
    if (location.hash != "#back" && popAppend === true) {
      history.pushState(null, null, location.href);
      history.replaceState(null, null, "#back");
      popAppend = false;
    }

    $(this).parents(".modal").hide();
    $("#modal-first .modal_container").css("opacity", 1);
    restraint_bar = false;
  });
  let flg_final = false;
  $("#restraint_toucher").hover(
    function () {
if ($(".user_form").length > 0) {
        $("#modal_final").show();
        $("#modal-first .modal_container").css("opacity", 0);

        if (flg_final == true) {
          $("#modal_final .late-open").removeClass("late-open");
          $("#modal_final .dot-flashing").remove();
          return;
        }

        let delayTime = 1500;
        let timeCount = 1;
        let time = timeData;
        let text = [
          "ちなみに…ここまで" +
          time.min +
          "分" +
          time.sec +
          "秒ほどお時間をいただいております。",
          "ご希望条件の確認はあと少しです。",
          "ここまで来たなら、今、結果を確認しておくことをおすすめします。",
        ];
        $.each(text, function (idx, elem) {
          let timing = delayTime * timeCount;
          timeCount++;
          let html = getAdminFukidashi(elem);
          setTimeout(function () {
            $("#modal_final_contents").append(html);
          }, timing);
        });
        flg_final = true;
      } else {
        $("#modal-first .modal_container").css("opacity", 0);
        restraint_bar = true;
      }
    },
    function () { }
  );
  $(".first-modal__option-btn").on("click", function (event) {
    event.stopPropagation();
    if ($("body").hasClass("diagnosis-started")) return;
    $("body").addClass("diagnosis-started");
    $("body").addClass("first-modal-checked");
    $("#modal-first").addClass("is-selected");
    $("body").addClass("green");
    if (!$('#results input[name="diagnosis_start"]').length) {
      $("#results").append('<input type="text" name="diagnosis_start" value="開始">');
    }

    $(".select_modal").removeClass("active");
    $(".select_modal_body").removeClass("active");
    getNext($(this).data("next") || $(this).find("input[type='radio']").data("next") || "q01");
  });

  function updateRemainingTime() {
    var now = new Date();
    var targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      21,
      0,
      0
    );
    var remainingTime = targetTime - now;

    if (remainingTime <= 0) {
      $(".first-modal__body__footer").hide();
      clearInterval(timer);
    } else {
      $(".first-modal__body__footer").show();
    }

    var hours = Math.floor(remainingTime / (1000 * 60 * 60));
    var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    document.getElementById("remaining-hour").textContent = hours.toString();
    document.getElementById("remaining-minute").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("remaining-second").textContent = seconds
      .toString()
      .padStart(2, "0");
  }
  $(document).off("click", ".option");
  $(document).on("click", ".option", function () {
    const itemId = $(this).parents(".option_list").data("itemid");
    const isScrollbar = $(this).data("is_scroll");
    const isMultiselect = $(this).data("is_multiselect");
    const isDropdown = $(this).data("is_dropdown");
    const isRadio = $(this).data("is_radio");
    if (isScrollbar || isMultiselect || isDropdown || isRadio) return;
    let selected = $(this).data("selected");
    if (selected == "city_name") {
      alert(selected);
    }

    const nextId = $(this).data("next");
    const answer = $(this).data("answer");
    let inputHtml =
      '<input type="text" name="' + itemId + '" value="' + selected + '">';
    $("#results").append(inputHtml);
    $("#parameter")[0].value += itemId;
    removeOptionsHtml();

    scrollToBottom(itemId);
    $("#parameter")[0].value += answer;
    if (!selected || !itemId) return;
    setAnswerHtml(itemId, selected);
    $(".modify").addClass("modify--inactive");

    getNext(nextId);
  });
  $(document).on("change", ".option_list input[type='checkbox']", function () {
    const $optionList = $(this).closest(".option_list");
    const itemId = $optionList.data("itemid");
    const nextButton = document.getElementById(`chat-next-btn-${itemId}`);
    if (!nextButton) return;

    const $checkedBoxes = $optionList.find("input[type='checkbox']:checked");
    const enable = $checkedBoxes.length > 0;
    nextButton.disabled = !enable;

    let selected = "";
    let answer = "";
    $checkedBoxes.each(function () {
      selected += this.dataset.selected + ", <br>";
      answer += this.value;
    });
    selected = selected.replace(/, <br>$/, "");
    nextButton.setAttribute("data-selected", selected);
    nextButton.setAttribute("data-answer", answer);
  });
  $(document).off("click", "input[type='radio'].radio_list__item__label-text");
  $(document).on(
    "click",
    "input[type='radio'].radio_list__item__label-text",
    function (event) {
      event.stopPropagation();

      let radio;
      if ($(event.target).is(".radio_list__item__label-text")) {
        radio = $(event.target).closest(".radio_list__item__label").find("input[type='radio']")[0];
        radio.checked = true;
      } else if ($(event.target).is("input[type='radio']")) {
        radio = event.target;
      }
      if (!radio) {
        return;
      }

      const itemId = $(radio).closest(".option_list").data("itemid");
      const selected = $(radio).data("selected");
      const answer = $(radio).val();
      const nextId = $(radio).data("next");
      let inputHtml = `<input type="text" name="${itemId}" value="${selected}">`;
      $("#results").append(inputHtml);
      $("#parameter")[0].value += itemId + answer;
      setTimeout(() => {
        removeOptionsHtml();
        if (!selected || !itemId) return;
        setAnswerHtml(itemId, selected);
      }, 100);
      if (nextId) {
        getNext(nextId);
      }
    }
  );

  $(document).on("click", ".p-caution_accordion_title", function () {
    $("#caution")[0].hidden = true;
  });

  $(document).on("click", ".caution-label", function () {
    $("#caution")[0].hidden = false;
  });
  const isiOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const inputEvent = isiOS ? "touchstart" : "input";

  $(document).on("input", "input[type='range']", function (event) {
    const itemId = event.target.id.split("-")[1];
    const value = event.target.value;

    $(`#scoped-rangeValue-${itemId}`).text(value + "万円");
    $(`#chat-next-btn-${itemId}`)[0].setAttribute(
      "data-selected",
      value + "万円"
    );

    const answer =
      itemId == "q01"
        ? value <= 10
          ? "a01"
          : value <= 50
            ? "a02"
            : "a03"
        : value <= 120
          ? "a45"
          : value <= 300
            ? "a46"
            : value <= 500
              ? "a47"
              : value <= 700
                ? "a48"
                : "a49";
    $(`#chat-next-btn-${itemId}`)[0].setAttribute("data-answer", answer);
  });

  $(document).on("click", ".range-minus", function () {
    const itemId = $(this).parents(".option_list").data("itemid");
    const range = $(`#range-${itemId}`);
    const current = Number(range.val());
    const step = Number(range.attr("step"));
    range.val(Math.max(0, current - step));
    $(`#scoped-rangeValue-${itemId}`).text(range.val() + "万円");
    $(`#chat-next-btn-${itemId}`)[0].setAttribute(
      "data-selected",
      range.val() + "万円"
    );
    const value = range.val();
    const answer =
      itemId == "q01"
        ? value <= 10
          ? "a01"
          : value <= 50
            ? "a02"
            : "a03"
        : value <= 120
          ? "a45"
          : value <= 300
            ? "a46"
            : value <= 500
              ? "a47"
              : value <= 700
                ? "a48"
                : "a49";
    $(`#chat-next-btn-${itemId}`)[0].setAttribute("data-answer", answer);
  });

  $(document).on("click", ".range-plus", function () {
    const itemId = $(this).parents(".option_list").data("itemid");
    const range = $(`#range-${itemId}`);
    const current = Number(range.val());
    const step = Number(range.attr("step"));
    range.val(Math.min(current + step, Number(range.attr("max"))));
    $(`#scoped-rangeValue-${itemId}`).text(range.val() + "万円");
    $(`#chat-next-btn-${itemId}`)[0].setAttribute(
      "data-selected",
      range.val() + "万円"
    );
    const value = range.val();
    const answer =
      itemId == "q01"
        ? value <= 10
          ? "a01"
          : value <= 50
            ? "a02"
            : "a03"
        : value <= 120
          ? "a45"
          : value <= 300
            ? "a46"
            : value <= 500
              ? "a47"
              : value <= 700
                ? "a48"
                : "a49";
    $(`#chat-next-btn-${itemId}`)[0].setAttribute("data-answer", answer);
  });

  $(document).on("change", ".select-job", function () {
    const itemId = $(this).parents(".option_list").data("itemid");
    const answer = $(this)[0].selectedOptions[0].value;
    const nextButton = $(`#chat-next-btn-${itemId}`)[0];
    const enable = $(this)[0].value != "";
    if (enable) {
      nextButton.removeAttribute("disabled");
      nextButton.setAttribute("data-selected", $(this)[0].textContent);
      nextButton.setAttribute("data-answer", answer);
    } else nextButton.disabled = true;
  });
  $(document).on("change", "input[type='radio']", function () {
    const itemId = $(this).parents(".option_list").data("itemid");
    const selected = $(this).data("selected");
    const answer = $(this).val();
    const nextId = $(this).data("next");
    let inputHtml = `<input type="text" name="${itemId}" value="${selected}">`;
    $("#results").append(inputHtml);
    $("#parameter")[0].value += itemId + answer;

    setTimeout(() => {
      removeOptionsHtml();
      setAnswerHtml(itemId, selected);
    }, 300);
    if (nextId) {
      getNext(nextId);
    }
  });

  $(document).on("click", ".chat__form-btn", function () {
    const itemId = $(this).data("itemid");
    const nextId = $(this).data("next");
    const selected = $(this)[0].dataset.selected;
    const answer = $(this)[0].dataset.answer;
    if (
      nextId == "q01" ||
      nextId == "q02" ||
      nextId == "q03" ||
      nextId == "q04" ||
      nextId == "q05" ||
      nextId == "q06" ||
      nextId == "q07" ||
      nextId == "q08" ||
      nextId == "q09" ||
      nextId == "q10" ||
      nextId == "q11" ||
      nextId == "q12" ||
      nextId == "q13" ||
      nextId == "q14"
    ) {
      let inputHtml =
        '<input type="text" name="' + itemId + '" value="' + selected + '">';
      $("#results").append(inputHtml);
      $("#parameter")[0].value += itemId + answer;
      removeOptionsHtml();

      scrollToBottom(itemId);
      setAnswerHtml(itemId, selected);
      $(".modify").addClass("modify--inactive");

      getNext(nextId);
    }
  });
  $(document).on("click", ".modify", function () {
    $(".chat_result").remove();
    $("#modalEnd1").remove();
    $("#modalEnd2").remove();
    let itemId = $(this).parents(".chat_user").data("itemid");

    let answer = $("#parameter")[0].value;
    answer = answer.slice(0, answer.indexOf(itemId));
    $("#parameter")[0].value = answer;
    let answerIndex = $("#chats .chat_item").index(
      $(this).parents(".chat_item")
    );
    if (answerIndex == 0) {
      location.reload();
      return;
    }
    if (
      itemId == 2 ||
      itemId == 100 ||
      itemId == 101 ||
      itemId == 102 ||
      itemId == 103 ||
      itemId == 104 ||
      itemId == 105 ||
      itemId == 106 ||
      itemId == 107
    ) {
      $("#address_list").html("");
    }
    $("#chats .chat_item").each(function (index, element) {
      if (index >= answerIndex) {
        $(element).remove();
      }
    });

    $("#chats .p-card").each(function (index, element) {
      $(element).remove();
    });
    $("#chats .chat_options").last().show();
    let inputIndex = $("#results input").index(
      $('#results input[name="' + itemId + '"]')
    );
    $("#results input").each(function (index, element) {
      if (index >= inputIndex) {
        $(element).remove();
      }
    });
  });
  $(document).on("click", "#address_select dd", function () {
    let city = $(this).text();
$("#city_selected").text(city);
    $("#city_selected").data("selected", city);
    $("#city_selected").click();
  });
  $(document).on("keyup", ".user_form", function () {
    let tel = $("#tel").val();
    let tel_check = checkTel(tel);
    if (tel_check == true) {
      $("#user_form_btn").removeClass("inactive");
    } else {
      $("#user_form_btn").addClass("inactive");
    }
  });
  $(".js-set-value").on("click", function () {
    let id = $(this).attr("data-question-id");
    let name = $(this).attr("data-question-name");
    let val = $(this).attr("data-set-val");
    for (var i = 1; i <= 7; i++) {
      $("#q-modal" + i).hide();
    }
    if ($('input[name="' + name + '"]').length) {
      $('input[name="' + name + '"]').remove();
    }
    let ans = '<input type="hidden" name="' + name + '" value="' + val + '">';
    $("#results").append(ans);
    $(".select" + id).html(val);
    if (id < 7) {
      let next = Number(id) + 1;
      $("#q-modal" + next).show();
      if (
        $(".select" + id)
          .parent()
          .hasClass("next")
      ) {
        $(".next").removeClass("next");
        $(".select" + next)
          .parent()
          .addClass("next");
      }
    } else {
      $(".select" + id)
        .parent()
        .removeClass("next");

      if ($("#modalEnd1").length == 0) {
        if (
          $('input[name="25"]').val() &&
          $('input[name="26"]').val() &&
          $('input[name="factory"]').val() &&
          $('input[name="oodori"]').val() &&
          $('input[name="27"]').val() &&
          $('input[name="24"]').val() &&
          $('input[name="28"]').val()
        ) {
          $("body").append("<div id='modalEnd1' style='display: none;'></div>");

          getNext(72);
        }
      } else {
        scrollToBottom();
      }
    }
  });

  $(".js-set-value2").on("click", function () {
    let id = $(this).attr("data-question-id");
    let name = $(this).attr("data-question-name");
    let val = $(this).attr("data-set-val");
    for (var i = 8; i <= 14; i++) {
      $("#q-modal" + i).hide();
    }
    if ($('input[name="' + name + '"]').length) {
      $('input[name="' + name + '"]').remove();
    }
    let ans = '<input type="hidden" name="' + name + '" value="' + val + '">';
    $("#results").append(ans);
    $(".select" + id).html(val);
    if (id < 14) {
      let next = Number(id) + 1;
      $("#q-modal" + next).show();
      if (
        $(".select" + id)
          .parent()
          .hasClass("next")
      ) {
        $(".next").removeClass("next");
        $(".select" + next)
          .parent()
          .addClass("next");
      }
    } else {
      $(".select" + id)
        .parent()
        .removeClass("next");

      if ($("#modalEnd2").length == 0) {
        if (
          $('input[name="72"]').val() &&
          $('input[name="71"]').val() &&
          $('input[name="73"]').val() &&
          $('input[name="garage"]').val() &&
          $('input[name="parking"]').val() &&
          $('input[name="70"]').val() &&
          $('input[name="neiborhood"]').val()
        ) {
          $("body").append("<div id='modalEnd2' style='display: none;'></div>");

          if ($('input[name="10"]').val() == "特定条件") {
            getNext(46);
          } else {
            getNext(35);
          }
        }
      } else {
        scrollToBottom();
      }
    }
  });
  $(".js-q-modal-close").on("click", function () {
$(this).parents(".q-modal").hide();
  });

  $(document).on("click", ".js-question-modal", function () {
var classVal = $(this).attr("class");
    var classVals = classVal.split(" ");
    for (var i = 0; i < classVals.length; i++) {
      if (classVals[i].match("select") != null) {
        var id = Number(classVals[i].replace("select", ""));
      }
    }
Qmodal(1, id);
  });

  $(document).on("click", ".js-question-modal2", function () {
    var classVal = $(this).attr("class");
    var classVals = classVal.split(" ");
    for (var i = 0; i < classVals.length; i++) {
      if (classVals[i].match("select") != null) {
        var id = Number(classVals[i].replace("select", ""));
      }
    }
    Qmodal(2, id);
  });
});


function setAnswerHtml(id, selected) {
  let replyText;
  if (selected == "わからない") {
    replyText = "わかりません";
  } else if (selected == "はい" || selected == "いいえ") {
    replyText = selected;
  } else if (selected.match(".*いる$")) {
    replyText = selected.replace("いる", "います");
  } else if (id == "q23") {
    replyText = selected;
  } else {
    replyText = selected + "です";
  }
  let chatHtml = "";
  chatHtml += '<div class="chat_item chat_user" data-itemid="' + id + '">';
  chatHtml += '<div class="chat_user_text">' + replyText + "</div>";
  chatHtml += '<div class="chat_user_correction">';
  chatHtml += '<span class="modify modify--inactive">訂正する</span>';
  chatHtml += "</div>";
  chatHtml += "</div>";
  $("#chats").append(chatHtml);
  scrollToBottom(id);
}
function Qmodal(cnt, id) {
  if (cnt == 1) {
    for (var i = 1; i <= 7; i++) {
      $("#q-modal" + i).hide();
    }
  } else if (cnt == 2) {
    for (var i = 8; i <= 14; i++) {
      $("#q-modal" + i).hide();
    }
  }
  $("#q-modal" + id).show();
}


function updateProgressBar(nextId) {
  const $bar = $("#progress-bar");
  if (!$bar.length) return;
  if (nextId === "last") {
    $bar.fadeOut(300);
    return;
  }
  const match = String(nextId).match(/^q(\d+)$/);
  if (!match) return;
  const total = 7;
  const position = Math.min(parseInt(match[1], 10), total);
  const percent = Math.min(100, (position / total) * 100);
  const remaining = Math.max(0, total - position);
  $bar.find(".progress-bar__fill").css("width", percent + "%");
  $bar.find(".progress-bar__label").text(
    remaining > 0 ? "あと" + remaining + "問" : "ラスト！"
  );
}

function getNext(nextId) {
  updateProgressBar(nextId);
  const data = getQuestion(nextId);
  setNextHtml(data);
}


function setNextHtml(data) {
  if (data.id === "q06_before") {
    let specialHtml = `
<div class="chat_item chat_admin"><div class="chat_admin_img"></div><div class="chat_admin_info"><div class="chat_admin_name">マネーローンナビオペレーター</div><div class="chat_admin_text"><div class="dot-flashing"></div><span class="late-open">ご希望条件を確認します。</span></div></div>
<div class="note">※この質問は比較候補を整理するためのものであり、審査には影響しません。</div>
</div>
    `;

    scrollToBottom(data.id);
    setTimeout(() => {
      $("#chats").append(specialHtml);
getNext("q06");
    }, 500);

    return;
  }
  if (data.id === "last_before") {
    const annualIncomeRaw = $('input[name="q07"]').val();
    let annualIncome = 0;

    if (annualIncomeRaw?.includes("〜")) {
      const range = annualIncomeRaw.split("〜");
      const minIncome = Number(range[0].replace("万円", "").trim());
      const maxIncome = range[1]?.includes("万円")
        ? Number(range[1].replace("万円", "").trim())
        : minIncome;
      annualIncome = Math.floor((minIncome + maxIncome) / 2);
    } else if (annualIncomeRaw?.includes("以上")) {
      annualIncome = Number(annualIncomeRaw.replace("万円以上", "").trim());
    } else {
      annualIncome = Number(annualIncomeRaw?.replace("万円", "").trim());
    }

    let specialHtml = `
    <div class="chat_item last_before">
      <span class="result">ご希望条件に近いサービスを確認しています
      <Br>
      <img src="assets/js/assets/img/user.png" alt="ユーザ" class="user">
      </span>
      <span class="note">※入力内容は比較候補を整理するためのものです。各サービスの条件は詳細ページでご確認ください。</span>
    </div>
  `;

    scrollToBottom(data.id);
    setTimeout(() => {
      $("#chats").append(specialHtml);
getNext("last");
    }, 2000);

    return;
  }
  const QuestionData = [
    {
      id: 25,
      question: "物件は、海から近いですか？",
      next: 26,
      class: "select1",
    },
    {
      id: 26,
      question: "近所に川や湖はありますか？",
      next: "factory",
      class: "select2",
    },
    {
      id: "factory",
      question: "近所に工場はありますか？",
      next: "oodori",
      class: "select3",
    },
    {
      id: "oodori",
      question: "大通りの道路や車通りが多い面に接してますか？",
      next: 27,
      class: "select4",
    },
    {
      id: 27,
      question: "日当たりのよい立地ですか？",
      next: 24,
      class: "select5",
    },
    {
      id: 24,
      question: "山や林のなかに建っていますか？",
      next: 28,
      class: "select6",
    },
    {
      id: 28,
      question: "高台に建っていますか？",
      next: 72,
      class: "select7",
    },
  ];

  const QuestionData2 = [
    {
      id: 72,
      question: "庭・ベランダなどに移動が困難なものはございますか？",
      next: 71,
      class: "select8",
    },
    {
      id: 71,
      question: "室外機はいくつございますか？",
      next: 73,
      class: "select9",
    },
    {
      id: 73,
      question: "敷地内に車を駐車してますか？",
      next: "garage",
      class: "select10",
    },
    {
      id: "garage",
      question: "車庫は設置されてますか？",
      next: "parking",
      class: "select11",
    },
    {
      id: "parking",
      question: "施工会社の車を近くに駐車できる場所はありますか？",
      next: 70,
      class: "select12",
    },
    {
      id: 70,
      question: "テレビやBSなどのアンテナを設置していますか？",
      next: "neiborhood",
      class: "select13",
    },
    {
      id: "neiborhood",
      question: "隣の家から1メートル以上の幅はありますか？",
      next: 35,
      class: "select14",
    },
    
  ];
  let $chats = $("#chats");
  let timeDelay = 1300;
  let count = 0;
  $.each(data.questions, function (idx, elem) {
    if (data.type == "last") {

      const annualIncomeRaw = $('input[name="q07"]')?.val();

      let annualIncome = 0;
      if (annualIncomeRaw?.includes("〜")) {
        const range = annualIncomeRaw.split("〜");
        const minIncome = Number(range[0].replace("万円", "").trim());
        const maxIncome = range[1]?.includes("万円")
          ? Number(range[1].replace("万円", "").trim())
          : minIncome;
        annualIncome = Math.floor((minIncome + maxIncome) / 2);
      } else if (annualIncomeRaw?.includes("以上")) {
        annualIncome = Number(annualIncomeRaw.replace("万円以上", "").trim());
      } else {
        annualIncome = Number(annualIncomeRaw?.replace("万円", "").trim());
      }

      const amount = Math.floor(annualIncome / 3);

      elem = elem.replace("[AMOUNT]", amount);
    }
    count++;

    let time = timeDelay * count;
    let html = "";
    html += '<div class="chat_item chat_admin">';
    let match = elem.match(/^img(.*)/);

    if (match != null) {
      let img = getAjaxPath() + "/../assets/img/" + data.images[match[1]];
      html += '<img class="chat_admin_center-img" src="' + img + '">';
    } else if (elem == "input") {
      QmodalFlg = 1;
      html += '<div class="q-select">';

      var cnt = 1;
      QuestionData.forEach(function (item) {
        html += '<div class="q-select-item">';
        html += '<div class="q-select-item-title">' + item.question + "</div>";
        if (cnt == 1) {
          html +=
            '<div class="q-select-item-form next"><button class="js-question-modal select' +
            cnt +
            '">選択してください</button></div>';
        } else {
          html +=
            '<div class="q-select-item-form"><button class="js-question-modal select' +
            cnt +
            '">選択してください</button></div>';
        }
        html += "</div>";
        cnt += 1;
      });

      html += "</div>";

      $(".modify").removeClass("modify--inactive");
    } else if (elem == "input2") {
      QmodalFlg = 2;
      html += '<div class="q-select">';

      var cnt = 8;
      QuestionData2.forEach(function (item) {
        html += '<div class="q-select-item">';
        html += '<div class="q-select-item-title">' + item.question + "</div>";
        if (cnt == 8) {
          html +=
            '<div class="q-select-item-form next"><button class="js-question-modal2 select' +
            cnt +
            '">選択してください</button></div>';
        } else {
          html +=
            '<div class="q-select-item-form"><button class="js-question-modal2 select' +
            cnt +
            '">選択してください</button></div>';
        }
        html += "</div>";
        cnt += 1;
      });

      html += "</div>";

      $(".modify").removeClass("modify--inactive");
    } else {
      QmodalFlg = 0;
      html += '<div class="chat_admin_img"></div>';
      html += '<div class="chat_admin_info">';
      html += '<div class="chat_admin_name">マネーローンナビオペレーター</div>';
      html += '<div class="chat_admin_text">';
      html += '<div class="dot-flashing"></div>';
      html += '<span class="late-open">' + elem + "</span>";
      html += "</div>";
      html += "</div>";
    }
    html += "</div>";

    if (QmodalFlg == 1) {
      setTimeout(function () {
        $("#q-modal1").show();
      }, time + 2000);

      setTimeout(function () {
        $chats.append(html);
        scrollToBottom(data.id);
      }, time + 2500);
    } else if (QmodalFlg == 2) {
      $("#q-modal8").show();
      $chats.append(html);
      scrollToBottom(data.id);
    } else {
      setTimeout(function () {
        $chats.append(html);
        scrollToBottom(data.id);
      }, time);
    }
  });
  let type = data.type == undefined ? "default" : data.type;
  count++;
  time = timeDelay * count;
  if (type === "last") time += 2000;
  let optionsHtml = "";
  if (type == "default") {
    let half = Object.keys(data.options || [])?.length == 2 ? true : false;
    if (half == true) {
      optionsHtml +=
        '<div class="chat_item chat_options admin_chat_options admin_chat_options--half">';
    } else {
      optionsHtml += '<div class="chat_item chat_options admin_chat_options">';
    }
    optionsHtml += `<ul class="option_list" data-itemid="${data.id}">`;
    if (data.nextId)
      $.each(data.options, function (item, answerId) {
        optionsHtml += `<li class="option" data-selected="${item}" data-answer="${answerId}" data-next="${data.nextId}"><span>${item}</span></li>`;
      });
    else
      $.each(data.options, function (item, answerId) {
        const nextId = answerId == "a93" ? "q11" : "last";
        optionsHtml += `<li class="option" data-selected="${item}" data-answer="${answerId}" data-next="${nextId}"><span>${item}</span></li>`;
      });
    optionsHtml += "</ul>";
    optionsHtml += "</div>";
  } else if (type == "multiselect") {
    optionsHtml +=
      '<div class="chat_item chat_options admin_chat_options admin_chat_options--multiselect">';
    optionsHtml += '<ul class="option_list" data-itemid="' + data.id + '">';

    optionsHtml +=
      '<li class="option" data-selected="" data-next="" data-is_multiselect="true">';
    $.each(data.options, function (item, answerId) {
      optionsHtml += `
      <label class="multi_list__item__label">
            <div class="multi_list__item__label-check">
              <input type="checkbox" data-selected="${item}" name="multi-item[]" value="${answerId}">
            </div>
            <div class="multi_list__item__label-text">${item}</div>
      </label>
      `;
    });
    optionsHtml += "</li>";
    optionsHtml += "</ul>";

    optionsHtml += `
      <div class="chat_next_btn_wrap">
        <button type="button" id="chat-next-btn-${data.id}" data-itemid="${data.id}" class="chat__form-btn" data-selected="" data-next="${data.nextId}" disabled>次に進む</button>
      </div>
    `;

    optionsHtml += "</div>";
  } else if (type == "radio") {
    optionsHtml +=
      '<div class="chat_item chat_options admin_chat_options admin_chat_options--radio">';
    optionsHtml += '<ul class="option_list" data-itemid="' + data.id + '">';

    optionsHtml +=
      '<li class="option" data-selected="" data-next="" data-is_radio="true">';
    $.each(data.options, function (item, answerId) {
      optionsHtml += `
      <label class="radio_list__item__label">
        <input type="radio" data-selected="${item}" name="radio-item-${data.id}" value="${answerId}" data-next="${data.nextId}">
        <div class="radio_list__item__label-check">
        </div>
        <div class="radio_list__item__label-text">${item}</div>
      </label>
    `;
    });
    optionsHtml += "</li>";
    optionsHtml += "</ul>";

    optionsHtml += "</div>";
  } else if (type == "scrollbar") {
    optionsHtml +=
      '<div class="chat_item chat_options admin_chat_options admin_chat_options--scroll">';
    if (data.id == "q08") optionsHtml += '<div class="option_list_container">';
    optionsHtml += '<ul class="option_list" data-itemid="' + data.id + '">';

    optionsHtml +=
      '<li class="option" data-selected="" data-next="" data-is_scroll="true">';
    optionsHtml += `<div id="scoped-rangeValue-${data.id}">0万円</div>`;
    optionsHtml += '<div class="scoped-rangeBox">';
    optionsHtml += `<button type="button" class="range-minus" id="range-minus-${data.id}">-</button>`;
    optionsHtml += `<input type="range" id="range-${data.id
      }" name="loan_amount" min="0" max="${data.id == "q08" ? 100 : 1000
      }" step="10" value="0">`;
    optionsHtml += `<button type="button" class="range-plus" id="range-plus-${data.id}">+</button>`;
    optionsHtml += "</div>";
    optionsHtml += "</li>";
    optionsHtml += "</ul>";
    if (data.id == "q08") {
      optionsHtml += `<ul class="option_list" data-itemid="${data.id}">`;
      optionsHtml += `<li class="option" data-selected="100万円以上" data-answer="a45" data-next="q02"><span>100万円以上の方はこちらをチェック</span></li>`;
      optionsHtml += `</ul>`;
      optionsHtml += "</div/>";
    }
    optionsHtml += `
      <div class="chat_next_btn_wrap">
        <button type="button" id="chat-next-btn-${data.id}" data-itemid="${data.id
      }" class="chat__form-btn" data-selected="0万円"  data-answer="${data.id == "q08" ? "a01" : "a45"
      }" data-next="${data.nextId}">次に進む</button>
      </div>
    `;
    optionsHtml += "</div>";
  } else if (type == "dropdown") {
    optionsHtml += `
      <div class="chat_item chat_options admin_chat_options admin_chat_options--dropdown">
        <ul class="option_list" data-itemid="${data.id}">
          <li class="option" data-selected="" data-next="" data-is_dropdown="true">
            <select name="inquiry_job" id="select-job" class="select-job">
              <option value="">選択してください</option>
    `;
    $.each(data.options, function (item, answerId) {
      optionsHtml += `
        <option value="${answerId}">${item}</option>
      `;
    });
    optionsHtml += `
            </select>
          </li>
        </ul>

        <div class="chat_next_btn_wrap">
          <button type="button" id="chat-next-btn-${data.id}" data-itemid="${data.id}" class="chat__form-btn" data-selected="" data-next="${data.nextId}" disabled>次に進む</button>
        </div>
      </div>
    `;
  } else if (type == "last") {
  }
  setTimeout(function () {
    $chats.append(optionsHtml);
    scrollToBottom(data.id);

    if (type == "dropdown")
      new Choices("#select-job", {
        searchEnabled: false,
        shouldSort: false,
        placeholderValue: "",
        searchPlaceholderValue: "",
      });
    else if (type == "scrollbar") {
      $('input[type="range"]').rangeslider({ polyfill: false });
    }
    if (type == "last") {
      const $result = $("#inline-result");
      if ($result.length) {
        $result.show();
        setTimeout(function () {
          const top = $result.offset().top - 120;
          $("html, body").animate({ scrollTop: top }, 700, "swing");
        }, 400);
      }
    }
    $(".modify").removeClass("modify--inactive");
  }, time);
}


function scrollToBottom(itemid = 0) {
  const element = document.documentElement;
  const bottom = element.scrollHeight - element.clientHeight;
  let addition = 0;

  if ($("#chats .p-card").length > 0) {
    addition = Number($("#chats .p-card").css("height").slice(0, -2));
  }
  if (itemid === "q000") {
    const offset = 150;
    $("html, body").animate(
      {
        scrollTop: bottom - offset,
      },
      500,
      "swing"
    );
  } else if (itemid == "last" && $("#card_list").length > 0) {
    let alpha = parseInt($("#card_list").offset().top) - 80;
    window.scroll({ top: alpha, behavior: "smooth" })
  } else {
    const scrollTop = addition > 0 ? element.scrollHeight - addition * 4 : bottom;
    $("html, body").animate(
      {
        scrollTop: scrollTop,
      },
      addition === 0 ? 200 : 500,
      "swing"
    );
  }



}

function removeOptionsHtml() {
  $("#chats .chat_options").hide();
  $("#chats .p-card").hide();
  $("input[type='checkbox']").prop("checked", false);
  $("input[type='radio']").prop("checked", false);
}


function debounce(func, timeout = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function getQuestion(nextId) {
  let data = {};
  switch (nextId) {
    case "q01":
      data = {
        id: nextId,
        nextId: "q02",
        questions: [
          "こんにちは、マネーローンナビです。",
          "ご希望条件から、比較しやすいキャッシングサービス候補を整理します。",
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
      };
      break;
    case "q02":
      data = {
        id: nextId,
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
      };
      break;
    case "q03":
      data = {
        id: nextId,
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
      };
      break;
    case "q04":
      data = {
        id: nextId,
        nextId: "q05",
        questions: ["他社借入金額に近いものを選んでください。"],
        options: {
          "なし": "debtNone",
          "1〜49万円": "debt1",
          "50〜99万円": "debt50",
          "100万円以上": "debt100",
        },
        type: "radio",
      };
      break;
    case "q05":
      data = {
        id: nextId,
        nextId: "q06",
        questions: ["希望借入額に近いものを選んでください。"],
        options: {
          "5万円以下": "amount5",
          "10万円前後": "amount10",
          "30万円前後": "amount30",
          "50万円以上": "amount50",
        },
        type: "radio",
      };
      break;
    case "q06":
      data = {
        id: nextId,
        nextId: "last",
        questions: ["希望スピードを教えてください。"],
        options: {
          "今日中": "speedToday",
          "近日中": "speedSoon",
          "急がない": "speedLater",
        },
        type: "radio",
      };
      break;
    case "last":
      data = {
        id: "last",
        questions: [
          "ご希望条件に近いサービスを確認しています。",
        ],
        type: "last",
      };
      break;
  }
  data.selected = null;
  return data;
}

