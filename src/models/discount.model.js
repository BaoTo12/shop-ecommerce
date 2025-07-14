"use strict"
const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = "Discount"
const COLLECTION_NAME = "Discounts"

const inventorySchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true },
    discount_uses_count: { type: Number, required: true }, // the number of used discounts
    discount_users_used: { type: Array, default: [] }, // who uses discounts
    discount_max_uses_per_user: { type: Number, required: true }, // the maximum number of accounts a single user can use,
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ["all", "special"] },
    discount_product_ids: {type: Array, default: []} // Discount is applied to what products
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    discount: model(DOCUMENT_NAME, inventorySchema)
}