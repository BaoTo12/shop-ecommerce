"use strict"

const { Schema, model } = require("mongoose");
const { default: slugify } = require("slugify");

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
    product_description: {
        type: String,
    },
    product_slug: String,
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
    },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    // thess fields are not used for select so we name it without prefix schema name
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        // when mongoose does query this field will be ignored
        select: false
    },
    isPublish: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

// product middleware
productSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})


// clothing product
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop" // document name
    },
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
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop" // document name
    },
}, {
    collection: "Electronics",
    timestamps: true
})

// furniture product
const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop" // document name
    },
}, {
    collection: "Furniture",
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothing", clothingSchema),
    electronics: model("Electronics", electronicsSchema),
    furniture: model("Furniture", furnitureSchema)
}