"use strict"

const ApikeyService = require("../services/apikey.service")

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization"
}

// this is middleware
const checkApiKey = async (req, res, next) => {
    try {
        // check if api key presents in header
        const key = req.headers[HEADER.API_KEY]?.toString()
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

const checkPermission = (permission) => {
    return (req, res, next) => {
        // check if permissions are present
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permissions denied"
            })
        }
        // check if permissions are valid
        const validPermissions = req.objKey.permissions.includes(permission)
        if (!validPermissions) {
            return res.status(403).json({
                message: "Permissions denied"
            })
        } else {
            return next()
        }
    }
}

module.exports = {
    checkApiKey,
    checkPermission
}