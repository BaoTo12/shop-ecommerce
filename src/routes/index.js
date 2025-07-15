"use strict"
const express = require("express")
const { checkApiKey, checkPermission } = require("../auth/checkAuth")
const router = express.Router()


// check API Key
router.use(checkApiKey)
// check Permissions
router.use(checkPermission("0000"))

router.use(`/${process.env.API_VERSION}/api/checkout`, require("./checkout"))
router.use(`/${process.env.API_VERSION}/api/product`, require("./product"))
router.use(`/${process.env.API_VERSION}/api/discount`, require("./discount"))
router.use(`/${process.env.API_VERSION}/api/cart`, require("./cart"))
router.use(`/${process.env.API_VERSION}/api`, require("./access"))
module.exports = router