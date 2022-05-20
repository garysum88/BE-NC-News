
const db = require('../db/connection.js')
const fs = require("fs/promises")

exports.fetchAPI = () => {

    return fs.readFile("./endpoints.json","UTF-8")
    .then((file)=>{
        return JSON.parse(file)
    })

}
