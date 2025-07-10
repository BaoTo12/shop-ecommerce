"use strict"

const JWT = require("jsonwebtoken")
const crypto = require('crypto');


const createTokenPairs = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "2 days"
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "7 days"
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err)
            } else {
                console.log(`decode verify::`, decode)
            }
        })


        return { accessToken, refreshToken }
    } catch (error) {
        console.error(error)
    }
}

const createPublicKey = (publicKeyString) => {
    return crypto.createPublicKey({
        key: publicKeyString,
        type: "pkcs1",
        format: "pem",
    })
}

module.exports = {
    createTokenPairs,
    createPublicKey
}