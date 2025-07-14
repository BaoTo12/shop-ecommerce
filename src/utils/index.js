"use strict"

const _ = require("lodash")

const getInfoShopData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}
// ["a", "b"] ==> {"a": 1, "b": 1}
const getSelectedFields = (select = []) => {
    return Object.fromEntries(select.map(field => [field, 1]))
}

module.exports = {
    getInfoShopData,
    getSelectedFields
}