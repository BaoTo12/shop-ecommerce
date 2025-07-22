"use strict"

const commentModel = require("../models/comment.model")
const { convertToObjectId } = require("../utils/index")

/**
 * ?KEY FEATURES
 * 1. Add Comment [User | Shop]
 * 2. Get a list of comments [User | Shop]
 * 3. Delete a comment [User | Shop | Admin]
 */
class CommentService {
    static async createComment({
        productId, parentCommentId, content, userId
    }) {
        const comment = await commentModel.create({
            comment_userId: userId,
            comment_productId: productId,
            comment_parentId: parentCommentId,
            comment_content: content
        })

        // Calculate the index for the comment
        // Case:  This is not parent comment
        if (parentCommentId) {

        } else {
            let indexValue;
            let maxRightValue = await commentModel.findOne({
                comment_productId: convertToObjectId(productId)
            }, "comment_right", {
                sort: {
                    comment_right: -1
                }
            })
            // Case: there are other parent comments
            if (maxRightValue) {
                indexValue = maxRightValue + 1;
            } else {
                indexValue = 1
            }
        }

        comment.comment_left = indexValue;
        comment.comment_right = indexValue + 1;
        await comment.save()

        return comment;
    }
}

module.exports = CommentService