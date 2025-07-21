const Redis = require("redis");

class RedisPubSubService {
    constructor() {
        this.subscriber = Redis.createClient();
        this.publisher = Redis.createClient();

        this.subscriber.on("error", error => console.error("Redis Subscriber Error", error))
        this.publisher.on("error", error => console.error("Redis Publisher Error", error))


        this.subscriber.connect().catch(console.error)
        this.publisher.connect().catch(console.error)
    }

    publish(channel, message) {
        console.log({channel, message});
        
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err, reply) => {
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
            if (channel === subscriberChannel) {
                callback(channel, message)
            }
        })
    }
}


module.exports = new RedisPubSubService();