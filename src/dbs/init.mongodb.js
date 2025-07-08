"use strict"
const mongoose = require("mongoose")
const connectString = "mongodb://localhost:27017/shopDEV"
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

        mongoose.connect(connectString)
            .then(_ => {
                countConnect()
                console.log("Connect MongoDB Successfully")
            })
            .catch(err => console.log("Error While Connecting MongoDB"))
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