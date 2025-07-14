"use strict"

const { BadRequestError, NotFoundError } = require("../core/error.response")
const { discount } = require("../models/discount.model")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectId } = require("../utils")

/*
    DISCOUNT SERVICE
    1. Generate Discount Code [Shop | Admin]
    2. Get Discount amount [User]
    3. Get all discount codes [User | Shop]
    4. Verify discount code [User]
    5. Delete discount Code [Admin | Shop]
    6. Cancel discount code [User]
*/
class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids,
            applies_to, name, description,
            type, value, max_value, max_uses, uses_count,
            max_uses_per_user
        } = payload

        // validate date
        if (new Date(start_date) > new Date(end_date) || new Date() > new Date(start_date)) {
            throw new BadRequestError("Error while creating discount due to date validation failed")
        }
        // check whether discount exists
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectId(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount existed!!")
        }
        // create new discount
        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    // * Update discount
    // static async updateDiscount() {

    // }

    
}

module.exports = DiscountService