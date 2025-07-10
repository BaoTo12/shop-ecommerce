"use strict"

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}
const ReasonStatusCode = {
    FORBIDDEN: "Bad Request Error",
    CONFLICT: "Conflict Error"
}

const {
    ReasonPhrases,
    statusCode
} = require("../utils/httpStatusCode")

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = statusCode.UNAUTHORIZED) {
        super(message, status)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError
}