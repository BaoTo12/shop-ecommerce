const Redis = require("redis");

class RedisPubSubService {
    constructor() {
        this.subscriber = Redis.createClient();
        this.publish = Redis.createClient();
    }

    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.publish(channel, message, (err, reply) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(reply)
                }

            })
        })
    }
    subscribe(channel, callback) {
        this.subscriber.subscribe(channel, callback)
        this.subscriber.on("message", (subscriberChannel, message) => {
            if(channel === subscriberChannel){
                callback(channel, message)
            }
        })
    }
}


module.exports = new RedisPubSubService();