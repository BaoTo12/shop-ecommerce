"use strict"
const { SuccessResponse } = require("../core/success.response")
const CartService = require("../services/cart.service")
class CartController {
    /**
     * @desc add to cart for user
     * @param {int} userId
     * @param {*} res
     * @param {*} next
     * @method POST
     * @url /v1/api/cart/user
     * @return {}
     */
    addToCart = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: 'Create new Cart Successfully',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    // update + -
    update = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: 'Update new Cart Successfully',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    delete = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: 'deleted Cart Successfully',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: 'List Cart Successfully',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}


module.exports = new CartController()