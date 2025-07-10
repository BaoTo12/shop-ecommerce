"use strict"

const { Schema, model } = require('mongoose');
const { randomBytes } = require("node:crypto")

const COLLECTION_NAME = "Apikeys"
const DOCUMENT_NAME = "Apikey"

var apikeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        // default: function () {
        //     return randomBytes(20).toString("hex")
        // }
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


module.exports = model(DOCUMENT_NAME, apikeySchema);