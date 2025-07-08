const mongoose = require("mongoose")

const countConnect = () => {
    let numConnection = mongoose.connections.length;
    console.log(`Number of Connections:: ${numConnection}`);
}

module.exports = {
    countConnect
}