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