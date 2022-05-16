const express = require("express")
const app = express()
const { getTopics } = require("./controllers/topic.controller.js")
app.use(express.json())

app.get("/api/topics",getTopics)


//404 Error for non-existent path
app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Endpoint not found" });
});

//400 Bad Request
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: "Bad request" });
  } else {
    next(err);
  }
});

//500 Internal Server Error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
});


module.exports = app;
