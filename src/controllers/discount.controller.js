"use strict"

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service")

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Successful Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }
    getAllDiscountsByShopId = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get all discounts by shopId successfully',
            metadata: await DiscountService.getAllDiscountsByShopId({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get Discount Amount Successfully',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    getAllProductsWithDiscountCode = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get All Products By Discount Code',
            metadata: await DiscountService.getAllProductsWithDiscountCode({
                ...req.query
            })
        }).send(res)
    }
}


module.exports = new DiscountController