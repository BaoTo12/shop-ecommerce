"use strict"
const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = "inventory"
const COLLECTION_NAME = "inventories"

const inventorySchema = new Schema({
    invent_product: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
    invent_shop: {
        type: Schema.Types.ObjectId,
        ref: "shop"
    },
    invent_stock: {
        type: Number,
        required: true
    },
    invent_location: {
        type: String,
        default: "unknown"
    },
    invent_reservations: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}