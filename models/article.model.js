const db = require('../db/connection.js')

exports.fetchArticle = (articleId) => {

    return db.query('SELECT author, title, article_id, body, topic, created_at, votes FROM articles WHERE article_id = $1',[articleId])
    .then((response)=>{

        // Added a customised error 404 where the article_id does not exist (this returning nothing from the database)
        
        // This check the rows of response, if the length equals to 0, this means no article belongs to that article_id

        if (response.rows.length === 0) {
            return Promise.reject({status: 404, message:"Article with that article_id does not exist"})
        }

        return response.rows[0]
    })
}


exports.updateArticle = (articleId,newVote) => {

    if (typeof newVote === "undefined") {
        return Promise.reject({ status : 400, message : "Bad request"})
    }

    if (typeof newVote !== "number") {
        return Promise.reject({ status : 400, message : "You should enter a number in inc_votes"})
    }

    else {
        return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *',[newVote,articleId])
        .then(response=> {
        
            if (response.rows.length === 0) {
                return Promise.reject({status: 404, message:"Article with that article_id does not exist"})
            }

        return response.rows[0]
        })
}
}