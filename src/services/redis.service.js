"use strict"

const redis = require("redis")
// is used to change a normal function to promise-based functions
const { promisify } = require("util")
const { reservationInventory } = require("../models/repositories/inventory.repo")
const redisClient = redis.createClient()

//Node.js Redis client operations were originally designed using callbacks, which means they follow this pattern:
// redisClient.setNX('mykey', 'myvalue', (error, result) => {
//     if (error) {
//         console.error('Something went wrong:', error);
//     } else {
//         console.log('Operation result:', result);
//     }
// });

// pExpire Đặt thời gian tự động hủy khóa (milliseconds)
const pexpire = promisify(redisClient.pExpire).bind(redisClient)
// setNX Tạo khóa nếu chưa tồn tại (atomic operation)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)


// this is optimistic locking
// Chiếm khóa để thực hiện cập nhật tồn kho
const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2025_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3 seconds tam lock

    for (let i = 0; i < retryTimes; i++) {
        // tao mot thang, thang nao nam giu duoc vao thanh toan
        const result = await setnxAsync(key, expireTime);
        console.log(`result:::`, result);
        if (result === 1) {
            // Cập nhật tồn kho trong DB
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return key;
        } else {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}
// del Giải phóng khóa sau khi hoàn thành
const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}