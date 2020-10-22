const mongoose = require("mongoose");
const express = require("express");
const app = express();
const http = require("http");

module.exports = class Application {
    constructor() {
        this.setupExpress();
        this.setupMongoConnection();
    }

    setupExpress() {
        const server = http.createServer(app);
        server.listen(3000, () => {
            console.log('Running on port 3000....');
        });
    }

    setupMongoConnection() {
        mongoose.Promise = global.Promise;
        mongoose.connect("mongod://localhost/frosh2D", { useNewUrlParser: true },  () => { console.log("mongodb is runing...."); });
    }

}
