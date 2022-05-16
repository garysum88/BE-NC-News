const { fetchTopics } = require('../models/topic.model')

const getTopics = (req,res) => {
    fetchTopics().then((topics)=> {
        res.status(200).send({topics})
    })
}


module.exports = { getTopics }