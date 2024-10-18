const app = require("express").Router();
const EventEmitter = require("node:events");
const { fileWriteAndRetrieve } = require("../service/files");
const ApiResponse = require("../models/ApiResponse");
const emitter = new EventEmitter();

app.get("/app/:name", async (req, res) => {
  res.render("index");
});

app.post("/data", async (req, res, next) => {
  console.log(req.body.data);
  const data = await fileWriteAndRetrieve(req.body.data);
  emitter.emit("msg", { message: data });
  res.json(new ApiResponse());
});

app.get("/events", (req, res, next) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send an initial message
  res.write(`data: Connected to server\n\n`);
  emitter.on("msg", (data) => {
    res.write("Ainash");
    res.flushHeaders();
  });
  req.on("close", () => {
    res.end();
  });
});
module.exports = app;
