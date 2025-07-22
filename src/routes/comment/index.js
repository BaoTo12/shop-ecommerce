"use strict"
const express = require("express")
const { authenticationV2 } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");
const commentController = require("../../controllers/comment.controller");



const router = express.Router();


router.use(authenticationV2)

router.post("", asyncHandler(commentController.createComment))
router.get("", asyncHandler(commentController.getCommentsByParentId))


module.exports = router;