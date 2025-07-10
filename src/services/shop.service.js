"use strict"

const shopModel = require("../models/shop.model")

const findByEmail = async ({ email, select = {
    email: 1, password: 1, name: 1, status: 1, roles: 1
} }) => {
    // the select function is projection in mongodb that means include these fields
    // 1 - include     0 - exclude 
    return await shopModel.findOne({ email }).select(select).lean()
}

module.exports = {
    findByEmail
}