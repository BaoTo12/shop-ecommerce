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
        // if (typeof object[field] === "object") {
        //     removeFalseField(object[field])
        // }
    })

    return object
}

const updateNestedObject = object => {
    const final = {}
    Object.keys(object).forEach(key => {
        if (typeof object[key] === "object" && !Array.isArray(object[key])) {
            const response = updateNestedObject(object[key])
            Object.keys(response).forEach(a => {
                final[`${key}.${a}`] = response[a]
            })
        } else {
            final[key] = object[key]
        }
    })
    return final
}
module.exports = {
    getInfoShopData,
    getSelectedFields,
    getUnSelectedFields,
    removeFalseField,
    updateNestedObject
}