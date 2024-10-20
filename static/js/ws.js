document.addEventListener("DOMContentLoaded", function () {
  let ws;
  const ul = document.querySelector("ul");
  const input = document.querySelector("textarea");

  function closeConnection() {
    if (!!ws) {
      ws.close();
    }
  }
  function sendMessage() {
    document.querySelector("button").addEventListener("click", () => {
      if (input.value == undefined || input.value === "") return;

      let s = input.value.split("\n");
      console.log(s);
      s.forEach((e) => {
        if (e != "") {
          const li = document.createElement("li");
          li.textContent =
            "Your input: " + new Date().toLocaleString() + ": " + e;
          ul.appendChild(li);
          ul.appendChild(li);
        }
      });
      ws.send(JSON.stringify(input.value));
      input.value = "";
    });
  }

  sendMessage();

  closeConnection();
  ws = new WebSocket("ws://localhost:3000");

  ws.addEventListener("error", () => {
    console.log("WebSocket error");
  });

  ws.addEventListener("open", () => {
    console.log("WebSocket connection established");
  });

  ws.addEventListener("close", () => {
    console.log("WebSocket connection closed");
  });

  ws.addEventListener("message", (msg) => {
    alert("Someone changed the file");
    console.log(JSON.parse(msg.data));
    let list = JSON.parse(msg.data);
    let count = 0;
    list.forEach((e) => {
      const li = document.createElement("li");
      li.textContent =
        "Updated: " + new Date().toLocaleString() + ": " + count + "." + e;
      ul.appendChild(li);
      count++;
    });
    count = 0;
  });

  console.log("writing into existing file");
  (function () {
    var measurer = $("<span>", {
      style:
        "display:inline-block;word-break:break-word;visibility:hidden;white-space:pre-wrap;",
    }).appendTo("body");
    function initMeasurerFor(textarea) {
      if (!textarea[0].originalOverflowY) {
        textarea[0].originalOverflowY = textarea.css("overflow-y");
      }
      var maxWidth = textarea.css("max-width");
      measurer
        .text(textarea.text())
        .css(
          "max-width",
          maxWidth == "none" ? textarea.width() + "px" : maxWidth
        )
        .css("font", textarea.css("font"))
        .css("overflow-y", textarea.css("overflow-y"))
        .css("max-height", textarea.css("max-height"))
        .css("min-height", textarea.css("min-height"))
        .css("min-width", textarea.css("min-width"))
        .css("padding", textarea.css("padding"))
        .css("border", textarea.css("border"))
        .css("box-sizing", textarea.css("box-sizing"));
    }
    function updateTextAreaSize(textarea) {
      textarea.height(measurer.height());
      var w = measurer.width();
      if (textarea[0].originalOverflowY == "auto") {
        var mw = textarea.css("max-width");
        if (mw != "none") {
          if (w == parseInt(mw)) {
            textarea.css("overflow-y", "auto");
          } else {
            textarea.css("overflow-y", "hidden");
          }
        }
      }
      textarea.width(w + 2);
    }
    $("textarea.autofit").on({
      input: function () {
        var text = $(this).val();
        if ($(this).attr("preventEnter") == undefined) {
          text = text.replace(/[\n]/g, "<br>&#8203;");
        }
        measurer.html(text);
        updateTextAreaSize($(this));
      },
      focus: function () {
        initMeasurerFor($(this));
      },
      keypress: function (e) {
        if (e.which == 13 && $(this).attr("preventEnter") != undefined) {
          e.preventDefault();
        }
      },
    });
  })();
});
