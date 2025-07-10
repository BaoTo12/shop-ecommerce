"use strict"

const apikeyModel = require("../models/apikey.model")

class ApikeyService {
    static async findById(key) {
        const apikey = await apikeyModel.findOne({ key, status: true }).lean();

        return apikey;
    }
}

module.exports = ApikeyService