"use strict"
const { SuccessResponse } = require("../core/success.response")
const CommentService = require("../services/comment.service")

class CommentController {
    createComment = async (req, res, err) => {
        return new SuccessResponse({
            message: "Create Comment Successfully !!",
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()