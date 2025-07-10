"use strict"
// use Token Schema to store: User, UserId, PublicKey, RefreshToken
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";


var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Shop"
    },
    privateKey: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    refreshToken: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
}
);

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);