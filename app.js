const express = require("express")
const app = express()
const { getTopics } = require("./controllers/topic.controller.js")
const { getArticle } = require("./controllers/article.controller.js")

app.get("/api/topics",getTopics)

app.get("/api/articles/:article_id",getArticle)


// 400 Error message
app.use((err, req, res, next) => {
  if (err.code==="22P02") {
    res.status(400).send({ message: "Bad request" });
  }
  else {
    next(err)
  }
});

//404 Error for non-existent path
app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Endpoint not found" });
});

// Custom Error message
// Can be used for custom 404 where a specified id NOT found
app.use((err, req, res, next) => {
  res.status(err.status).send({ message: err.message });
});

//500 Internal Server Error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
});


module.exports = app;
