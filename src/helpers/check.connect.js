"use strict"
const mongoose = require("mongoose")
const os = require("os")
const process = require("process")

const _SECOND = 5000;

// Count number of connections
const countConnect = () => {
    let numConnection = mongoose.connections.length;
    console.log(`Number of Connections:: ${numConnection}`);
}

// check database connection overload
const checkOverLoad = () => {
    setInterval(() => {
        let numConnection = mongoose.connections.length;
        let cores = os.cpus().length;
        let memoryUsage = process.memoryUsage().rss;
        // Assume each cord can handle 5 connection
        let maximumConnection = cores * 5;

        console.log(`Active connections: ${numConnection}`);
        console.log(`Memory Usage:${memoryUsage / 1024 / 1024}MB`);

        if (numConnection > maximumConnection) {
            console.log("Database Connection is overload");

        }

    }, _SECOND) // run every 5s
}

module.exports = {
    countConnect,
    checkOverLoad
}