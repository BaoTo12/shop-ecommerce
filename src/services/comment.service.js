"use strict"

const { BadRequestError, NotFoundError } = require("../core/error.response");
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
        let indexValue;
        // Calculate the index for the comment
        // Case:  This is not parent comment
        if (parentCommentId) {
            // find reply parent
            const commentParent = await commentModel.findOne({
                _id: convertToObjectId(parentCommentId)
            })
            if (!commentParent) throw new BadRequestError(`There is no comment with ${parentCommentId}::Comment_Parent`)
            console.log({ commentParent });


            indexValue = commentParent.comment_right;

            // update other comments
            await commentModel.updateMany({
                comment_productId: convertToObjectId(productId),
                comment_right: {
                    $gte: indexValue
                }
            }, {
                $inc: { comment_right: 2 }
            })
            await commentModel.updateMany({
                comment_productId: convertToObjectId(productId),
                comment_left: {
                    $gt: indexValue
                }
            }, {
                $inc: { comment_left: 2 }
            })

        } else {

            let maxRightValue = await commentModel.findOne({
                comment_productId: convertToObjectId(productId)
            }, "comment_right", {
                sort: {
                    comment_right: -1
                }
            })
            // Case: there are other parent comments
            if (maxRightValue) {
                indexValue = maxRightValue.comment_right + 1;
            } else {
                indexValue = 1
            }
        }
        console.log({ indexValue });

        comment.comment_left = indexValue;
        comment.comment_right = indexValue + 1;
        await comment.save()

        return comment;
    }


    static async getCommentsByParentId({
        productId,
        commentParentId = null,
        limit = 50,
        offset = 0 // skip
    }) {
        // const skip = (offset) * limit;
        if (commentParentId) {
            const commentParent = await commentModel.findById(commentParentId)
            console.log({ commentParent });

            if (!commentParent) throw new BadRequestError(`There is no comment with id: ${commentParentId}::Comment Parent`)

            const comments = await commentModel.find({
                comment_productId: convertToObjectId(productId),
                comment_left: { $gt: commentParent.comment_left },
                comment_right: { $lte: commentParent.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            }).limit(limit)
                .lean()
            return comments;
        }


        const comments = await commentModel.find({
            comment_productId: convertToObjectId(productId),
            comment_parentId: commentParentId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        })
        return comments;
    }
}

module.exports = CommentService