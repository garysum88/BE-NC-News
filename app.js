const express = require("express")
const app = express()
const { getTopics, getArticle } = require("./controllers/topic.controller.js")


app.get("/api/topics",getTopics)

app.get("/api/articles/:article_id",getArticle)


//404 Error for non-existent path
app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Endpoint not found" });
});

// Customer Error message
// Can be used for custom 404 where a specified id NOT found
app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status).send({ message: err.message });
});

//500 Internal Server Error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
});


module.exports = app;
