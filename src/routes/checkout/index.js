"use strict"
const asyncHandler = require("../../helpers/asyncHandler")
const express = require("express")
const checkoutController = require("../../controllers/checkout.controller")
const router = express.Router()

router.post("/review", asyncHandler(checkoutController.checkoutReview))


module.exports = router