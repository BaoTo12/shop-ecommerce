"use strict"

const { product, electronics, clothing, furniture } = require("../product.model")
const { Types } = require("mongoose")

const queryProduct = async ({ query = {}, limit, skip }) => {
    return await product
        .find(query)
        // populate method performs what's essentially a join operation between collections
        .populate("product_shop", "name email -_id")
        // This sorts the results by the updateAt field in descending order
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        // This explicitly executes the query and returns a Promise
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

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })
    if (!foundShop) throw new null
    foundShop.isDraft = true;
    foundShop.isPublish = false;

    const savedShop = await foundShop.save();
    return savedShop;
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find(
        {
            isPublish: true,
            $text: { $search: regexSearch }
        },
        { score: { $meta: "textScore" } }
    )
        .sort({ score: { $meta: "textScore" } })
        .lean()
    return results
}
module.exports = {
    findAllDraftProductForShop,
    publishProductByShop,
    findAllPublicProductForShop,
    unPublishProductByShop,
    searchProductByUser
}