"use strict"
const mongoose = require("mongoose")

const connectString = "mongodb://localhost:27017/shopDEV"

mongoose.connect(connectString)
    .then(_ => console.log("Connected MongoDb Successfully"))
    .catch(err => console.log("Error While Connecting"))

if (1 === 1) {
    mongoose.set("debug", true)
    mongoose.set("debug", { color: true })

}


module.exports = mongoose