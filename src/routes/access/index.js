"use strict"
const express = require("express")
const accessController = require("../../controllers/access.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const router = express.Router()

// sign up
router.post("/shop/signup", asyncHandler(accessController.signUp))
// log in
router.post("/shop/login", asyncHandler(accessController.login))


// authentication
router.use(authenticationV2)
// logout
router.post("/shop/logout", asyncHandler(accessController.logout))
router.post("/shop/refreshToken", asyncHandler(accessController.handleRefreshToken))

module.exports = router