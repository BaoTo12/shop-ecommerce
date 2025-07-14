"use strict"

const { cart } = require("../models/cart.model")

/*
    Key features: Cart Service
        Add product to cart[user]
        Reduce product quantity by one[User]
        Increase product quantity by One[User]
        get cart[User]
        Delete cart[User]
        Delete cart item[User]
*/
class CartService {

    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: "active" }
        const updateOrInsert = {
            // syntax { $addToSet: { <field>: <value> } }
            /*
                Kiểm tra toàn bộ mảng hiện có
                Nếu value chưa tồn tại → Thêm vào mảng
                Nếu value đã tồn tại → Không thay đổi mảng
            */
            $addToSet: {
                cart_products: product
            }
        }
        const options = { upSert: true, new: true }

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async addToCart({ userId, product = {} }) {
        // check cart for user
        const userCart = await cart.findOne({
            cart_userId: userId
        })
        if (!userCart) {
            // create cart for user
            return await CartService.createUserCart({ userId, product })
        }
    }
}


module.exports = CartService