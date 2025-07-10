"use strict"
const express = require("express")
const router = express.Router()


router.use(`/${process.env.API_VERSION}/api`, require("./access"))

// router.get("", (req, res, next) => {
//     return res.status(200).json({
//         message: "HELLO FAME!"
//     })
// })

module.exports = router