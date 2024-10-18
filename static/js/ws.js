document.addEventListener("DOMContentLoaded", function () {
  let ws;
  const ul = document.querySelector("ul");
  const input = document.querySelector("input");

  function closeConnection() {
    if (!!ws) {
      ws.close();
    }
  }
  function sendMessage() {
    document.querySelector("button").addEventListener("click", () => {
      if (input.value == undefined || input.value === "") return;
      const li = document.createElement("li");
      li.textContent = input.value;
      ul.appendChild(li);
      ws.send(JSON.stringify(input.value));
      input.value = "";
    });
  }

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
    console.log(JSON.parse(msg.data));
  });

  console.log("writing into existing file");
  sendMessage();
});
