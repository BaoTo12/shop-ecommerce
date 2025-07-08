const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express(); // used to initialize an instance of express

//TODO: init middleware
//?: morgan is used to log whenever users do requests
// morgan have 5 modes
/*
    1. dev --> output is concise and colored for dev purpose
    2. combined --> full output according to Apache Standard --> for production
    3. common --> like combined but with less output
    4. short --> default  
    5. tiny --> the shortest output among all types
*/
app.use(morgan("dev"))
//? helmet is a secure middleware that automatically sets a collection of HTTP headers to help protect your web app from common vulnerabilities
/*
    1. Adds security headers by default: A single call app.use(helmet()) injects multiple protections like CSP, HSTS, X-Frame-Options, and more
    2. Defends against specific attacks: Helps mitigate XSS, clickjacking, MIME sniffing, insecure referrer policies, HSTS enforcement
    3. Reduces fingerprinting: Removes headers like X-Powered-By so it’s harder for attackers to know your backend
*/
/* Common security risks
    1. XSS(Cross-site scripting) Prevention – Content-Security-Policy
    --> Problem: XSS happens when attackers inject malicious JavaScript into your site. 
    Once executed in users’ browsers, it can steal cookies, distort the UI, or hijack sessions.
    Header Role: Content-Security-Policy (CSP) sets strict rules about which domains are allowed to load scripts, styles, images, fonts, frames, etc.
    2. Clickjacking Prevention – X-Frame-Options
    --> Problem: Malicious sites could embed your page in an invisible iframe and trick users into clicking hidden buttons 
    --> Header Role: X-Frame-Options tells browsers whether your page can be embedded: "DENY": No framing allowed and "SAMEORIGIN": Only your own domain can frame it
    3. Server Fingerprint Reduction – X-Powered-By
    --> Problem: Revealing you're running Express (via X-Powered-By: Express) gives attackers hints about your tech stack and potential vulnerabilities.
    --> Header Role: Helmet removes this header, denying that clue and reducing reconnaissance risk .
    4. Enforce HTTPS – Strict-Transport-Security (HSTS)
    --> Problem: Users might access your site via HTTP or through an attacker-influenced downgrade, exposing traffic to MITM attacks.
    --> Header Role: Strict-Transport-Security tells browsers: "Always use HTTPS on future visits."
    5. MIME Sniffing Avoidance – X-Content-Type-Options: nosniff
    --> Problem: Browsers sometimes override your declared Content-Type and guess the type based on content — which could lead to executing text files as scripts.
    --> Header Role: X-Content-Type-Options: nosniff tells browsers to stick to the declared MIME type, avoiding confusion-based attacks
    
*/
app.use(helmet())
// ? compression: Compression in Node.js lets you shrink payloads (HTTP responses or files) using algorithms like Gzip or Brotli. 
// You trade a bit of CPU work for faster network transfers and lower bandwidth.
app.use(compression())
//TODO: init Database
require("./dbs/init.mongodb")

//TODO: init routers
app.get("/", (req, res, next) => {
    const stringCompress = "Hello Fan";

    return res.status(200).json({
        message: "Welcome ...",
        metadata: stringCompress.repeat(10000)
    })
})

//TODO: handle errors


module.exports = app;