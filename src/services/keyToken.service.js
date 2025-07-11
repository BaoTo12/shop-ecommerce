"use strict"

const keyTokenModel = require("../models/keyToken.model")
const { Types } = require("mongoose")

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            //? level 0
            // key generated from generateKeyPairSync is Buffer Object that means this key is in binary form
            //const publicKeyString = publicKey.toString();

            // const token = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return token ? token.publicKey : null

            // ? level 1
            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken,
            };
            // upsert: If no existing document matches the filter, a new one will be created with those fields and the user field set automatically
            // The operation returns the updated version of the document
            const options = { upsert: true, new: true };
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
            console.log({ tokens });

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }
    static removeKeyById = async (_id) => {
        return await keyTokenModel.deleteOne({ _id })
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static deleteKeyByUserId = async (userId) => {
        return await keyTokenModel.findOneAndDelete({ user: userId });
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken })
    }
}


module.exports = KeyTokenService