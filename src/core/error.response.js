"use strict"

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}
const ReasonStatusCode = {
    FORBIDDEN: "Bad Request",
    CONFLICT: "Already Existed"
}

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
    constructor(message = ReasonStatusCode.BAD, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError
}