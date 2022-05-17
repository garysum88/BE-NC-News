const { fetchArticle, updateArticle } = require('../models/article.model')

const getArticle = (req,res, next) => {

    const articleId = req.params.article_id

    fetchArticle(articleId).then((article)=>{
        res.status(200).send(article)
    })
    .catch(next)
    // Added a catch block to handle the error message when the articleId does not exist
    // This also needs to be handled in the model
}

const patchArticle = (req,res, next) => {

    const articleId = req.params.article_id
    const newVote = req.body.inc_votes

    updateArticle(articleId,newVote).then((article)=> {

        res.status(202).send({article})
    })

    .catch(next)
}



module.exports = { getArticle, patchArticle }