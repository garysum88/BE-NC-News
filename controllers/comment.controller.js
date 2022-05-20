
const { removeComment } = require("../models/comment.model")

const deleteComment = (req,res,next) => {
    const commentId = req.params.comment_id

removeComment(commentId).then((response)=> {
    res.status(204).send()
})
.catch(next)
}


module.exports = { deleteComment }