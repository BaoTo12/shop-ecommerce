"use strict"

const { findCartById } = require("../models/repositories/cart.repo")
const { BadRequestError } = require("../core/error.response")
class CheckoutService {
    //     {
    //     "cartId": "",
    //         "userId": "",
    //             "shop_order_ids": [
    //                 {
    //                     "shopId": "",
    //                     "shop_discount": [],
    //                     "item_products": [
    //                         {
    //                             "price": 0,
    //                             "quantity": 0,
    //                             "productId": ""
    //                         }
    //                     ]
    //                 }
    //                 {
    //                     "shopId": "",
    //                     "shop_discount": [
    //                      {
    //                          "shopId", "discountId", "codeId"
    //                      }
    //                      ],
    //                     "item_products": [
    //                         {
    //                             "price": 0,
    //                             "quantity": 0,
    //                             "productId": ""
    //                         }
    //                     ]
    //                 }
    //             ]
    //      }
    static async checkoutReview({ cartId, userId, shop_order_ids }) {
        // check whether cart exists
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError("Cart does not exist!!")

        const checkout_order = {
            totalPrice: 0, // tong tien hang (total item price)
            feeShip: 0, // phi van chuyen (shipping fee)
            totalDiscount: 0, // tong tien discount giam gia (total discount amount)
            totalCheckout: 0 // tong thanh toan (total checkout amount)
        }, shop_order_ids_new = [];

        // tinh tong tien bill (calculate total bill amount)
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discount = [], item_products = [] } = shop_order_ids[i];
            // check product available
            const checkProductServer = await checkProductByServer(item_products);
            console.log(`checkProductServer::`, checkProductServer);
            if (!checkProductServer[0]) throw new BadRequestError('order wrong!!!');

            // tong tien don hang (total order amount)
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price);
            }, 0);

            // tong tien truoc khi xu ly (total amount before processing)
            checkout_order.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId,
                shop_discount, // Assuming shop_discount is an array of discount objects
                priceRaw: checkoutPrice, // tine truoc khi giam gia (price before discount)
                priceApplyDiscount: checkoutPrice, // price after applying discount (initially same as raw price)
                item_products: checkProductServer // The products after server-side check
            };

            // neu shop_discounts ton tai > 0, check xem co hop le khong
            // (if shop_discounts exist > 0, check if they are valid)
            if (shop_discount.length > 0) {
                // gia su chi co mot discount (assume only one discount)
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discount[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                });
                // tong cong discount giam gia (total discount amount)
                checkout_order.totalDiscount += discount;

                // neu tien giam gia lon hon 0 (if discount amount is greater than 0)
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }

            // tong thanh toan cuoi cung (final total payment)
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout);
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckoutService