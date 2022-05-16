const express = require("express")
const app = express()
const { getTopics } = require("./controllers/topic.controller.js")


app.get("/api/topics",getTopics)


//404 Error for non-existent path
app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Endpoint not found" });
});

//500 Internal Server Error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
});


module.exports = app;
