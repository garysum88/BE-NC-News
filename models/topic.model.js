const db = require('../db/connection.js')

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then((response)=>{
        return response.rows
    })
    .catch((err) => {
        console.log(err)
    })
}
