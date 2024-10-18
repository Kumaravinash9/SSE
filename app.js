const express = require("express");
const cat = require("cat-me");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const ApiResponse = require("./models/ApiResponse");
const sse = require("./controller/sse");
const { WebSocketServer, WebSocket } = require("ws");
const { fileWriteAndRetrieve } = require("./service/files");

dotenv.config({
  path: "process.env",
});
app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.get("/web", (req, res, next) => {
  res.render("ws.html");
});

app.use(sse);
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(cat());
});

function onSocketPreError(error) {
  console.log(error);
}

function onSocketPostError(error) {
  console.log(error);
}

const wss = new WebSocketServer({ noServer: true });
server.on("upgrade", async (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", async (ws, req) => {
  ws.on("error", onSocketPostError);
  ws.on("message", (msg) => {
    if (msg === undefined || msg == "") return;
    fileWriteAndRetrieve(JSON.parse(msg)).then((data) => {
      console.log(data);
      wss.clients.forEach((c) => {
        if (c.readyState === WebSocket.OPEN && c != ws) {
          c.send(JSON.stringify(data));
        }
      });
    });
  });

  ws.on("open", () => {});

  ws.on("close", () => {
    console.log("Connection closed");
  });
});
