const redisPubsubService = require('../services/redisPubSub.service')

class InventoryServiceTest {
    constructor() {
        redisPubsubService.subscriber('purchase_events', (channel, message) => {
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`Updated inventory ${productId} with quantity ${quantity}`);
    }
}

module.exports = new InventoryServiceTest()
