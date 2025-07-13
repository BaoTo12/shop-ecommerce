"use strict"

const { product, electronics, clothing, furniture } = require("../product.model")
const { Types } = require("mongoose")

const queryProduct = async ({ query = {}, limit, skip }) => {
    return await product
        .find(query)
        .populate("product_shop", "name email -_id")
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllDraftProductForShop = async ({ query = {}, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}


const findAllPublicProductForShop = async ({ query = {}, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })
    if (!foundShop) throw new null
    foundShop.isDraft = false;
    foundShop.isPublish = true;

    const savedShop = await foundShop.save();
    return savedShop;
}


module.exports = {
    findAllDraftProductForShop,
    publishProductByShop,
    findAllPublicProductForShop
}