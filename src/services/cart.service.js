"use strict"

const { cart } = require("../models/cart.model")
const { getProductById } = require("../models/repositories/product.repo")
const { NotFoundError } = require("../core/error.response")
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
        const options = { upsert: true, new: true }
        const results = await cart.findOneAndUpdate(query, updateOrInsert, options);
        console.log({ results });

        return results
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            "cart_products.productId": productId,
            cart_state: "active"
        }
        const updateSet = {
            $inc: {
                "cart_products.$quantity": quantity
            }
        }
        const options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateSet, options)
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
        // cart is present but empty
        if (!userCart.cart_products.length) {
            userCart.cart_products = [...product]
            return await userCart.save()
        }

        // cart is present and has products
        return await CartService.updateUserCartQuantity({ userId, product })
    }
    // update cart
    /*
    shop_order_ids: [
        {   shopId,
            item_products: [
            {
                quantity,
                price,
                shopId,
                old_quantity,
                productId
            }
        ],
        _version}
    ]
    */
    static async addToCartV2({ userId, product = {} }) {
        const { product_id, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        // check product
        const foundProduct = await getProductById(product_id)
        if (!foundProduct) throw new NotFoundError("Cannot find Product!!")

        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError("Product Do Not Belong To This Shop")
        }
        if (quantity === 0) {
            // TODO: Delete
        }
        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                product_id,
                quantity: quantity - old_quantity
            }
        })
    }

    // Delete
    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' };
        const updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        };

        const deleteCart = await cart.updateOne(query, updateSet);

        return deleteCart;
    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}


module.exports = CartService