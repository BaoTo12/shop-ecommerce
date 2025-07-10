"use strict"
const express = require("express")
const { apiKey } = require("../auth/checkAuth")
const router = express.Router()


// check API Key
router.use(apiKey)
// check Permissions


router.use(`/${process.env.API_VERSION}/api`, require("./access"))


module.exports = router