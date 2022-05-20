
const db = require('../db/connection.js')

exports.removeComment = (commentId) => {

    const checkCommentIdPromise = 
    db.query(`
    SELECT * FROM comments 
    WHERE comment_id = $1`
    ,[commentId])

    const deleteCommentPromise =
    db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `,[commentId])

    return Promise.all([checkCommentIdPromise,deleteCommentPromise])
    .then((resolvedArr)=> {

        if(!resolvedArr[0].rows.length) {
            return Promise.reject({status : 404 , message : "The comment_id you entered does not exist"})
        }
        else {
        return resolvedArr[1].rows
        }

    })

}
