const express = require("express");
const morgan = require("morgan");
const app = express(); // used to initialize an instance of express

// init middleware
// morgan is used to log whenever users do requests
// morgan have 5 modes
/*
    1. dev --> output is concise and colored for dev purpose
    2. combined --> full output according to Apache Standard --> for production
    3. common --> like combined but with less output
    4. short --> default  
    5. tiny --> the shortest output among all types
*/
app.use(morgan("dev"))

// init Database


// init routers
app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "Welcome ..."
    })
})

// handle errors


module.exports = app;