"use strict"
const AccessService = require("../services/access.service")
const { CREATED } = require("../core/success.response")
class AccessController {
    signUp = async (req, res, next) => {
        console.log(`[P]::signUp::`, req.body)
        return new CREATED({
            message: "Register Successfully",
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}


module.exports = new AccessController()