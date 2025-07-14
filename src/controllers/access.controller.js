"use strict"
const AccessService = require("../services/access.service")
const { CREATED, SuccessResponse } = require("../core/success.response")
class AccessController {

    handleRefreshToken = async (req, res, next) => {
        // V1
        // return new SuccessResponse({
        //     message: "Gain Access Token Successfully",
        //     metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        // }).send(res)
        // V2
        return new SuccessResponse({
            message: "Gain Access Token Successfully",
            metadata: await AccessService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

    logout = async (req, res, next) => {
        return new SuccessResponse({
            message: "Logout Successfully",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    login = async (req, res, next) => {
        return new SuccessResponse({
            message: "Login Successfully",
            metadata: await AccessService.login(req.body)
        }).send(res)
    }


    signUp = async (req, res, next) => {
        return new CREATED({
            message: "Register Successfully",
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}


module.exports = new AccessController()