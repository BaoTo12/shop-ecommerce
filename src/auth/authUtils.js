"use strict"

const JWT = require("jsonwebtoken")
const crypto = require('crypto');
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");


const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESH_TOKEN: "x-rtoken-id"
}


const createTokenPairs = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            algorithm: "HS256",
            expiresIn: "2 days"
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: "HS256",
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

const authentication = asyncHandler(async (req, res, next) => {
    // 1 - check wether userId is present in header
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("UserId is not present in header")
    // 2 - get ketStore by userId
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("KeyStore not found when authentication")
    // 3 - verify Token
    // get access token
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Cannot find Access Token")
    try {
        // verify token
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (decodeUser.userId != userId) {
            throw new AuthFailureError("Invalid UserId")
        }
        req.keyStore = keyStore;
        // 5 - if all checks are ok --> return next()
        return next();
    } catch (error) {
        throw error
    }
    // 4 - check user is present in db

})
const authenticationV2 = asyncHandler(async (req, res, next) => {
    // 1 - check wether userId is present in header
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("UserId is not present in header")
    // 2 - get ketStore by userId
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("KeyStore not found when authentication")
    // 3.1 - verify refresh Token

    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            // get refresh Token
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
            // verify refresh token
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if (decodeUser.userId != userId) throw new AuthFailureError("Invalid UserId")
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            // 5 - if all checks are ok --> return next()
            return next();
        } catch (error) {
            throw error
        }
    }
    // 3.2 - verify access Token
    // get access token
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Cannot find Access Token")
    try {
        // verify access token
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (decodeUser.userId != userId) {
            throw new AuthFailureError("Invalid UserId")
        }
        req.keyStore = keyStore;
        // 5 - if all checks are ok --> return next()
        return next();
    } catch (error) {
        throw error
    }

})
const verifyJWT = async (token, privateKey) => {
    return await JWT.verify(token, privateKey)
}


module.exports = {
    createTokenPairs,
    createPublicKey,
    authentication,
    verifyJWT,
    authenticationV2
}