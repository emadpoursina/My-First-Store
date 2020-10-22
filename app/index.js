const express = require("express");
const app = express();
const http = require("http");

module.exports = class Application {
    constructor() {
        this.setupExpress();
    }

    setupExpress() {
        const server = http.createServer(app);
        server.listen(3000, () => {
            console.log('Running on port 3000....');
        });
    }

}
