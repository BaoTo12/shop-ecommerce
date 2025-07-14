"use strict"
const { inventory } = require("../inventory.model")

const insertInventory = async ({ product_id, shop_id, location = "unknown", stock }) => {
    return await inventory.create({
        invent_productId: product_id,
        invent_shopId: shop_id,
        location: location,
        invent_stock: stock
    })
}


module.exports = {
    insertInventory
}