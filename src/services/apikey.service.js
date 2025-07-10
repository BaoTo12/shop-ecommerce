"use strict"

const apikeyModel = require("../models/apikey.model")
const { randomBytes } = require("node:crypto")

class ApikeyService {
    static async findById(key) {
        apikeyModel.create({
            key: randomBytes(20).toString("hex"),
            permissions: ["0000"]
        })
        const apikey = await apikeyModel.findOne({ key, status: true }).lean();

        return apikey;
    }
}

module.exports = ApikeyService