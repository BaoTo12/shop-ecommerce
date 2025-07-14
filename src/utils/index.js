"use strict"

const _ = require("lodash")

const getInfoShopData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}
// ["a", "b"] ==> {"a": 1, "b": 1}
const getSelectedFields = (select = []) => {
    return Object.fromEntries(select.map(field => [field, 1]))
}

const getUnSelectedFields = (select = []) => {
    return Object.fromEntries(select.map(field => [field, 0]))
}

// remove false property fields
const removeFalseField = (object) => {
    Object.keys(object).forEach(field => {
        if (object[field] == null || object[field] == undefined) {
            delete object[field]
        }
        if (typeof object[field] === "object") {
            removeFalseField(object[field])
        }
    })
    // "product_variations": [],

    return object
}

module.exports = {
    getInfoShopData,
    getSelectedFields,
    getUnSelectedFields,
    removeFalseField
}