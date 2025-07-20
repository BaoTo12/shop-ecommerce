"use strict"
const { convertToObjectId } = require("../../utils")
const { inventory } = require("../inventory.model")

const insertInventory = async ({ product_id, shop_id, location = "unknown", stock }) => {
    return await inventory.create({
        invent_productId: product_id,
        invent_shopId: shop_id,
        location: location,
        invent_stock: stock
    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        invent_productId: convertToObjectId(productId),
        invent_stock: { $gte: quantity }
    }
    const updateSet = {
        $inc: {
            invent_stock: -quantity
        },
        $push: {
            invent_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }
    const options = { upsert: true, new: true };

    return await inventory.updateOne(query, updateSet, options);
}
module.exports = {
    insertInventory,
    reservationInventory
}