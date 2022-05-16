const { fetchTopics, fetchArticle } = require('../models/topic.model')

const getTopics = (req,res) => {
    fetchTopics().then((topics)=> {
        res.status(200).send({topics})
    })
}

const getArticle = (req,res, next) => {

    const articleId = req.params.article_id

    fetchArticle(articleId).then((article)=>{
        res.status(200).send(article)
    })
    .catch(next)
    // Added a catch block to handle the error message when the articleId does not exist
    // This also needs to be handled in the model
}

module.exports = { getTopics , getArticle}