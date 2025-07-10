"use strict"

const StatusCode = {
    OK: 200,
    CREATED: 201
}

const MessageStatusCode = {
    OK: "Success",
    CREATE: "Created Successfully"
}

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, messageStatusCode = MessageStatusCode.OK, metadata = {} }) {
        this.message = !message ? messageStatusCode : message;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}
class CREATED extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.CREATED, messageStatusCode = MessageStatusCode.CREATE, metadata }) {
        super({
            message,
            metadata,
            statusCode,
            messageStatusCode
        })
    }
}