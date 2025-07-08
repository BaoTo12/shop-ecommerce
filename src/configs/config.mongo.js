"use strict"

// level 0
// const config = {
//     app: {
//         port: 3000
//     },
//     db: {
//         host: "localhost",
//         port: 27017,
//         name: "shopDEV"
//     }
// }
// module.exports = config

// level 1
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        host: process.env.DEV_DB_HOST || "localhost",
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || "shopDEV",
    }
}

const pro = {
    app: {
        port: process.env.PRO_APP_PORT
    },
    db: {
        host: process.env.PRO_DB_HOST,
        port: process.env.PRO_DB_PORT,
        name: process.env.PRO_DB_NAME
    }
}

const config = { dev, pro }
const env = process.env.NODE_EVN || 'dev';
module.exports = config[env]