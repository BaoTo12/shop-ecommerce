"use strict"

const CheckoutService = require("../services/checkout.service")
const { SuccessResponse } = require("../core/success.response");
class CheckoutController {
    checkoutReview = async (req, res, next) => {
        return new SuccessResponse({
            message: "Checkout Successfully",
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}

module.exports = new CheckoutController()