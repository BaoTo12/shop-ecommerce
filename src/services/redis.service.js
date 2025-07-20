"use strict"

const redis = require("redis")
// is used to change a normal function to async function
const { promisify } = require("util")
const { reservationInventory } = require("../models/repositories/inventory.repo")
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)


// this is optimistic locking
const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3 seconds tam lock

    for (let i = 0; i < retryTimes.length; i++) {
        // tao mot thang, thang nao nam giu duoc vao thanh toan
        const result = await setnxAsync(key, expireTime);
        console.log(`result:::`, result);
        if (result === 1) {
            // thao tac voi inventory
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })
            if(isReservation.modifiedCount){
                await pexpire(key, expireTime)
                return key
            }
            return key;
        } else {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}