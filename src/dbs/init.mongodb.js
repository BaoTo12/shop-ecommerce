"use strict"
const { db: { host, name, port } } = require("../configs/config.mongo")
const mongoose = require("mongoose")
const connectString = `mongodb://${host}:${port}/${name}`
const { countConnect } = require("../helpers/check.connect")

class Database {

    constructor() {
        this.connect();
    }

    connect(type = "mongo") {
        if (1 === 1) {
            mongoose.set("debug", true)
            mongoose.set("debug", { color: true })
        }

        mongoose.connect(connectString, {
            maxPoolSize: 100
        })
            .then(_ => {
                countConnect()
                console.log("Connect MongoDB Successfully 🌟")
            })
            .catch(err => console.log("Error While Connecting MongoDB ❌"))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance;
    }
}

const mongoDbInstance = Database.getInstance();

module.exports = mongoDbInstance;