"use strict"

const ApikeyService = require("../services/apikey.service")

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization"
}

// this is middleware
const apiKey = async (req, res, next) => {
    try {
        // check if api key presents in header
        const key = req.header[HEADER.API_KEY]
        if (!key) {
            return res.status(403).json({
                message: "Forbidden Error"
            })
        }

        // check ApiKey in database
        const objKey = await ApikeyService.findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden Error"
            })
        }
        // if objKey is present
        req.objKey = objKey
        return next()
    } catch (error) {
        console.error(error)
    }
} 

module.exports = {
    apiKey
}