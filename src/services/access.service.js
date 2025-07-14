"use strict"

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const { randomBytes } = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPairs, verifyJWT } = require("../auth/authUtils");
const { getInfoShopData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

class AccessService {
    // V2 for handleRefreshToken
    static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenError("Refresh Token has been used --> ERROR")
        }
        if (keyStore.refreshToken !== refreshToken) throw new ForbiddenError("Refresh Token is not valid")

        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError("Shop is not registered")

        // if found we create a new key pairs and put the old refresh token ito refreshTokenUsed
        const tokens = await createTokenPairs({
            userId: foundShop._id,
            email
        }, keyStore.publicKey, keyStore.privateKey)


        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })
        return {
            user,
            tokens
        }
    }

    static handleRefreshToken = async (refreshToken) => {
        // check this refreshToken in blackList in keyTokenSchema refreshTokenUsed
        const foundRefreshToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        // if this refresh token is in blacklist
        if (foundRefreshToken) {
            // find the user relates to this refresh token
            const { userId, email } = await verifyJWT(foundRefreshToken, foundRefreshToken.privateKey)
            console.log("[1]--", { userId, email });
            // delete all keys related to this uerId
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenError("Refresh Token has been used --> ERROR")
        }
        // if refreshToken is not used --> look for refreshToken in database to check this is our token
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if (holderToken) {
            // verify refreshToken is valid or not
            const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
            console.log("[2]--", { userId, email });
            // check UserId
            const foundShop = await findByEmail({ email })
            if (!foundShop) throw new AuthFailureError("Shop is not registered")

            // if found we create a new key pairs and put the old refresh token ito refreshTokenUsed
            const tokens = await createTokenPairs({
                userId: foundShop._id,
                email
            }, holderToken.publicKey, holderToken.privateKey)


            await holderToken.updateOne({
                $set: {
                    refreshToken: tokens.refreshToken
                },
                $addToSet: {
                    refreshTokensUsed: refreshToken
                }
            })
            return {
                userId: { userId, email },
                tokens
            }
        } else {
            throw new ForbiddenError("Refresh Token is not found while gaining access token")
        }
    }

    static logout = async (keyStore) => {
        const deletedKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({ deletedKey });

        return deletedKey;
    }

    static login = async ({ email, password, refreshToken = null }) => {
        // 1 - check email
        const shop = await findByEmail({ email });
        if (!shop) {
            throw new BadRequestError("Shop not found with " + email)
        }
        // 2 - match password
        const match = bcrypt.compare(password, shop.password);
        if (!match) {
            throw new AuthFailureError("Password is not match")
        }
        // 3 - create access token and refresh token and save
        const privateKey = randomBytes(64).toString("hex")
        const publicKey = randomBytes(64).toString("hex")
        // 4 - generate tokens
        const tokens = await createTokenPairs({
            userId: shop._id,
            email
        }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey,
            userId: shop._id
        })
        // 5 - return data
        return {
            shop: getInfoShopData({ fields: ["_id", "name", "email"], object: shop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        //TODO: check email whether it exists
        // when we use shopModel.findOne({ email }) --> mongoose wraps data in something called a Mongoose document 
        // This Mongoose document is a special object that has methods attached to it. 
        /*
            shop.status = 'active'  // Change a field
            await shop.save()       // Save changes back to database
            shop.toJSON()          // Convert to plain object
            shop.isModified('status')  // Check if a field was changed
        */
        // ? When you add .lean() to your query, you're telling Mongoose "I don't need all those extra features, just give me 
        // ? the raw data." The result is a plain JavaScript object that looks exactly like what's stored in MongoDB, but without any of the Mongoose magic attached.
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError("Error: Shop already Registered", 400)
        }
        // TODO: Create shop
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log({ hashedPassword });

        const newShop = await shopModel.create({
            email,
            password: hashedPassword,
            name,
            roles: [RoleShop.SHOP]
        })

        if (newShop) {
            // generate token for new registered user
            // Using asymmetric key
            // Create privateKey is used for signing key, publicKey is used for verifying key
            // const { privateKey, publicKey } = generateKeyPairSync("rsa", {
            //     modulusLength: 4096, // Key size in bits → security/performance tradeoff
            //     publicKeyEncoding: {
            //         type: "pkcs1", // Format standard: “Subject Public Key Info” --> spki
            //         // Public Key Crypto Standard
            //         format: "pem", // Encoding container: Base64 with header/footer
            //     },
            //     privateKeyEncoding: {
            //         type: "pkcs1",  // Format: generic container including algorithm info
            //         format: "pem", // Base64 again
            //     }
            // })

            const privateKey = randomBytes(64).toString("hex")
            const publicKey = randomBytes(64).toString("hex")

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            });

            if (!keyStore) {
                return {
                    message: "KeyStore error!!"
                }
            }
            // const publicKeyObject = createPublicKey(publicKeyString)
            // create Token Pair
            const tokens = await createTokenPairs({ userId: newShop._id, email }, publicKey, privateKey)

            return {
                shop: getInfoShopData({ fields: ["_id", "name", "email"], object: newShop }),
                tokens
            }
        }
        return null
    }
}
// ? Necessary methods to work with "Mongoose Model"
/* 
    1. findOne(filter, projection)
    2. find(filter)
    3. create
    4. findOneAndUpdate --> return the updated version
    5. findByIdAndUpdate 
    6. updateMany --> return result.modifiedCount tells you how many were updated
    7. updateOne --> doesn't return
    8. findOneAndDelete --> delete and return it
    9. findByIdAndDelete --> delete and return it
    10. deleteMany --> result.deletedCount tells you how many were deleted
*/
/*
    Find with additional options
    const shops = await shopModel.find({ status: 'active' })
    .limit(10)        // Only return 10 documents
    .skip(20)         // Skip the first 20 documents (for pagination)
    .sort({ createdAt: -1 })  // Sort by creation date, newest first
    .select('name email status')  // Only include these fields
    .lean()           // Return plain objects, not Mongoose documents
*/

module.exports = AccessService