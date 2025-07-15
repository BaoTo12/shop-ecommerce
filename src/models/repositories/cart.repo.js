"use strict"
const { cart } = require("../cart.model")
const { convertToObjectId } = require("../../utils/index")

const findCartById = async (cartId) => {
    return await cart.findOne({ _id: convertToObjectId(cartId), cart_state: true }).lean()
}


module.exports = {
    findCartById
}