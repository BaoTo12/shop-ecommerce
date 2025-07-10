"use strict"

const _ = require("lodash")

const getInfoShopData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

module.exports = {
    getInfoShopData
}