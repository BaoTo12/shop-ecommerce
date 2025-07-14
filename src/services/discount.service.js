"use strict"

const { BadRequestError, NotFoundError } = require("../core/error.response")
const { discount } = require("../models/discount.model")
const { checkDiscountExist, findAllDiscountCodesUnSelect } = require("../models/repositories/discount.service")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectId } = require("../utils")

/*
    DISCOUNT SERVICE
    1. Create Discount Code [Shop | Admin]
    2. Get Discount amount [User]
    3. Get all discount codes [User | Shop]
    4. Apply discount code [User]
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
            max_uses_per_user, users_used
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

    static async getAllProductsWithDiscountCode({
        code, shopId, userId, limit, page
    }) {
        if (!shopId) throw new BadRequestError("Missing shopId")
        if (!code) throw new BadRequestError("Missing Discount code")
        // check whether discount exists
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectId(shopId)
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError("Discount Does not exist!!")
        }
        // check what products this discount applied to
        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;
        if (discount_applies_to === "all") {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectId(shopId),
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"]
            });
        }
        if (discount_applies_to === "specific") {
            console.log("specific");
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"]
            });
        }
        console.log({ products });
        return products;
    }

    static async getAllDiscountsByShopId({ limit = 50, page = 1, shopId }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectId(shopId),
                discount_is_active: true
            },
            unselect: ["__v", "discount_shopId"],
            model: discount
        })
        return discounts;
    }
    // Apply discount code
    /*
        products = [
            {
                product_id,
                shop_id,
                quantity,
                name,
                price
            }
        ]
    */
    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExist({
            discount_code: code,
            discount_shopId: convertToObjectId(shopId)
        })

        if (!foundDiscount) {
            throw new NotFoundError(`Cannot find discount with code ${code}`)
        }
        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_users_used,
            discount_max_uses_per_user,
            discount_type,
            discount_value
        } = foundDiscount;
        if (!discount_is_active) throw new NotFoundError(`Discount with code ${code} is not active yet`)
        if (!discount_max_uses) throw new NotFoundError(`Discount with code ${code} has reached its usage limit`)

        if ( new Date() > new Date(foundDiscount.discount_end_date))
            throw new BadRequestError(`Discount with code ${code} is expired`)

        // check min value
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new BadRequestError(`Discount requires a minimum value ${discount_min_order_value}`)
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userUseDiscount = discount_users_used.find(user => user.userId === userId)
            // TODO
            if (userUseDiscount) {

            }
        }

        // check discount is fixed amount or percentage
        const amount = discount_type === "fixed amount" ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }


    // Delete discount
    static async deleteDiscountCode({ shopId, code }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: code,
            discount_shopId: convertToObjectId(shopId)
        })
        return deleted
    }
    // Cancel discount
    static async cancelDiscountCode({ code, shopId, userId }) {
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectId(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError(`discount doesn't exist`)

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
        return result
    }
}

module.exports = DiscountService