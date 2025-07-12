"use strict"

const { product, electronics, clothing, furniture } = require("../product.model")

const findAllDraftProductForShop = async ({ query = {}, limit, skip }) => {
    return await product
        .find(query)
        .populate("product_shop", "name email -_id")
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}


module.exports = {
    findAllDraftProductForShop
}