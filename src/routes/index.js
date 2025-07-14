"use strict"
const express = require("express")
const { checkApiKey, checkPermission } = require("../auth/checkAuth")
const router = express.Router()


// check API Key
router.use(checkApiKey)
// check Permissions
router.use(checkPermission("0000"))

router.use(`/${process.env.API_VERSION}/api`, require("./access"))
router.use(`/${process.env.API_VERSION}/api/product`, require("./product"))
router.use(`${process.env.API_VERSION}/discount`, require("./discount"))

module.exports = router