const { fetchArticle, updateArticle, fetchAllArticles, fetchComments , addComment} = require('../models/article.model')

const getArticle = (req,res, next) => {

    const articleId = req.params.article_id

    fetchArticle(articleId).then((article)=>{
        res.status(200).send({article})
    })
    .catch(next)
    // Added a catch block to handle the error message when the articleId does not exist
    // This also needs to be handled in the model
}

const patchArticle = (req,res, next) => {

    const articleId = req.params.article_id
    const newVote = req.body.inc_votes

    updateArticle(articleId,newVote).then((article)=> {

        res.status(200).send({article})
    })

    .catch(next)
}


const getAllArticles = (req,res,next) => {

    fetchAllArticles().then((articles)=>{
        res.status(200).send({articles})
    })
    .catch(next)
}


const getComments = (req,res,next) => {

    const articleId = req.params.article_id

    fetchComments(articleId).then((comments)=>{
        res.status(200).send({comments})
    })
    .catch(next)
}

const postComment = (req,res,next) => {
    const articleId = req.params.article_id
    const commentBody = req.body.body
    const author = req.body.username


    addComment(articleId,author,commentBody).then((comment)=> {

        res.status(201).send({comment})
    })
    .catch(next)
}


module.exports = { getArticle, patchArticle, getAllArticles, getComments , postComment}