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

// create index for search
// Performs full-text search across string fields
// Uses an inverted index to map terms to documents for fast, scalable lookups.
productSchema.index({ product_name: "text", product_description: "text" })

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


// full-text search in mongodb
//? Step1: Create Text Index
// Single Field Text Index: db.collection.createIndex({ "title": "text" })

// Multiple Field Text Index:
// db.collection.createIndex({
//     "title": "text",
//     "description": "text",
//     "content": "text"
// })

// Compound Text Index with Weights:
// db.collection.createIndex({
//     "title": "text",
//     "description": "text"
// }, {
//     "weights": {
//         "title": 10,      // Higher weight = higher relevance
//         "description": 1
//     }
// })

// ? Step 2: Basic Text Search Queries
// Simple Word Search:
// Find documents containing "mongodb"
// db.collection.find({ $text: { $search: "mongodb" } })

// Multiple Word Search (OR logic):
// Find documents containing "mongodb" OR "database"
// db.collection.find({ $text: { $search: "mongodb database" } })

// Phrase Search:
// Find documents containing the exact phrase "full text search"
// db.collection.find({ $text: { $search: "\"full text search\"" } })

// Exclusion Search:
// Find documents containing "mongodb" but NOT "tutorial"
// db.collection.find({ $text: { $search: "mongodb -tutorial" } })

//? Step 3: Advanced Query Features
// Relevance Scoring:
// db.collection.find(
//     { $text: { $search: "mongodb tutorial" } },
//     { score: { $meta: "textScore" } }
// ).sort({ score: { $meta: "textScore" } })

// Language-Specific Search:
// db.collection.find({
//     $text: {
//         $search: "tutorial",
//         $language: "english"
//     }
// })

// ! What is weight in mongoDB Search
/*
    Definition: Think of weight as a way to tell MongoDB "this field is more important than that field when someone searches."

*/
// ! Understanding Scoring in MongoDB Text Search
// Scoring is MongoDB's way of answering the question "how well does this document match what the user is looking for?" 
