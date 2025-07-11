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
    StatusCodes
} = require("../utils/httpStatusCode")

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {

        super(message, status)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NotFoundError) {
        super(message, status)
    }
}
class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
        super(message, status)
    }
}


module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}