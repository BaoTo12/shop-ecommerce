"use strict"

const { getUnSelectedFields, getSelectedFields } = require("../../utils");
const { discount } = require("../discount.model");

const findAllDiscountCodesUnSelect = async ({
    limit, page, sort = "ctime", filter, unSelect, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortBy)
        .select(getUnSelectedFields(unSelect))
        .lean()
    return documents
}

const findAllDiscountCodesSelect = async ({
    limit, page, sort = "ctime", filter, select, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortBy)
        .select(getSelectedFields(select))
        .lean()
    return documents
}


const checkDiscountExist = async (filter) => {
    return await discount.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    checkDiscountExist
}