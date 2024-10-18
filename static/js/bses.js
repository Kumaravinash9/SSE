document.addEventListener("DOMContentLoaded", function () {
  const ul = document.querySelector("ul");
  const input = document.querySelector("textarea");

  //evensource
  const eventSource = new EventSource("http://localhost:3000/events");
  eventSource.onmessage = function (event) {
    console.log(event.data);
    console.log("Avinash Kumar");
    let count = 0;
    let list = event.data;

    list.forEach((e) => {
      if (e != "") {
        const li = document.createElement("li");
        li.textContent =
          "Updated: " + new Date().toLocaleString() + ": " + count + "." + e;
        ul.appendChild(li);
        ul.appendChild(li);
      }
    });

    count = 0;
  };
  eventSource.onerror = function (event) {
    console.log("Error occurred:", event);
  };
  async function sendMessage() {
    document.querySelector("button").addEventListener("click", () => {
      if (input.value == undefined || input.value === "") return;
      console.log(input.value);
      fetch("http://localhost:3000/data", {
        method: "POST", // Specify the request method
        headers: {
          "Content-Type": "application/json", // Indicate that the body is JSON
        },
        body: JSON.stringify({ data: input.value }), // Convert the input to a JSON string
      }).then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // Handle non-200 responses
        }
        let s = input.value.split("\n");
        console.log(s);
        /*s.forEach((e) => {
          if (e != "") {
            const li = document.createElement("li");
            li.textContent =
              "Your input: " + new Date().toLocaleString() + ": " + e;
            ul.appendChild(li);
            ul.appendChild(li);
          }
        });*/
        input.value = "";
      });
    });
  }

  eventSource.close = function () {
    console.log("close the connection");
  };

  sendMessage();
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
