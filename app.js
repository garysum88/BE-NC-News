const express = require("express")
const app = express()
const { getTopics } = require("./controllers/topic.controller.js")
const { getArticle, patchArticle , getAllArticles , getComments , postComment} = require("./controllers/article.controller.js")
const { getUsers } = require("./controllers/user.controller")
const { deleteComment } = require("./controllers/comment.controller")
const { getAPI } = require("./controllers/other.controller.js")


app.use(express.json())

app.get("/api/topics",getTopics)

app.get("/api/articles/:article_id",getArticle)

app.patch("/api/articles/:article_id",patchArticle)

app.get("/api/users",getUsers)

app.get("/api/articles", getAllArticles )

app.get("/api/articles/:article_id/comments", getComments)

app.post("/api/articles/:article_id/comments", postComment)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api", getAPI)

//404 Error for non-existent path
app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Endpoint not found" });
});

// Error message
app.use((err, req, res, next) => {
  if (err.code==="22P02") {
    res.status(400).send({ message: "Bad request" });
  }
  if (err.code==="23503") {
    res.status(404).send({ message: "Not found" }); 
  }
  else {
    next(err)
  }
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
