"use strict"

const { getSelectedFields, getUnSelectedFields, convertToObjectId } = require("../../utils")
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


const findAllProducts = async ({ limit, sort, page = 1, filter, select }) => {
    const skip = (page - 1) * limit;
    // The -1 in mongoose is a sorting directive that tells MongoDB to sort documents in descending order, while 1 would sort in ascending order. 
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const results = await product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        // The .select() method in Mongoose controls which fields are returned in your query results.
        .select(getSelectedFields(select))
        .lean()

    return results
}
const findProduct = async ({ product_id, unSelect }) => {
    return await product
        .findById(product_id)
        .select(getUnSelectedFields(unSelect))
}
const updateProductById = async ({ product_id, payload, model, isNew = true }) => {
    return await model.findByIdAndUpdate(product_id, payload, {
        new: isNew
    })
}

const getProductById = async (product_id) => {
    return await product.findById(convertToObjectId(product_id)).lean()
}

module.exports = {
    findAllDraftProductForShop,
    publishProductByShop,
    findAllPublicProductForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById
}