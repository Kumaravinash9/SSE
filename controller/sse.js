const app = require("express").Router();
const EventEmitter = require("node:events");
const { fileWriteAndRetrieve } = require("../service/files");
const emitter = new EventEmitter();

app.get("/app/:name", async (req, res) => {
  const data = await fileWriteAndRetrieve(req.params.name);
  emitter.emit("msg", { message: data });
  res.render("index");
});

app.get("/events", (req, res, next) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send an initial message
  res.write(`data: Connected to server\n\n`);
  emitter.on("msg", (data) => {
    res.write(`data: Message ${data["message"].length}\n\n`);
  });
  req.on("close", () => {
    res.end();
  });
});
module.exports = app;
