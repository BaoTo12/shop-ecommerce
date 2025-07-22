"use strict"
const { SuccessResponse } = require("../core/success.response")
const CommentService = require("../services/comment.service")

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Create Comment Successfully !!",
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List of comments',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete Comment Successfully",
            metadata: await CommentService.deleteComments(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()