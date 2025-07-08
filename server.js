// used to declare port to launch our server
const app = require("./src/app");

const PORT = 3055;

const server = app.listen(PORT, () => {
    console.log(`Started WebService eCommerce with PORT:${PORT} `);
});

// subscribe a event handler for SIGINT Which is entering Ctrl+C in terminal
process.on("SIGINT", () => {
    server.close(() => console.log("Exit Server eCommerce")
    )
})