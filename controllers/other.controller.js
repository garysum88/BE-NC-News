
const { fetchAPI } = require("../models/other.model")

const getAPI = (req,res,next) => {


fetchAPI().then((response)=> {

    res.status(200).send(response) 
})

}


module.exports = { getAPI }
