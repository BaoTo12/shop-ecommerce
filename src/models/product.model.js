"use strict"

const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products"

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ["Electronics", "Clothing", "Furniture"]
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop" // document name
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


// clothing product
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
    material: String,
}, {
    collection: "Clothes",
    timestamps: true
})

// electronics product
const electronicsSchema = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: String,
    color: String,
}, {
    collection: "Clothes",
    timestamps: true
})



module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothing", clothingSchema),
    electronics: model("Electronics", electronicsSchema )
}