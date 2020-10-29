const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');

module.exports = class Application {
    /**
     * Setup application
     */
    constructor() {
        this.setupExpress();
        this.setupMongoConnection();
        this.setConfig();
        this.setRoutes();
    }

    setupExpress() {
        const server = http.createServer(app);
        server.listen(3000, () => {
            console.log('Running on port 3000....');
        });
    }

    setupMongoConnection() {
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/frosh2D", { useNewUrlParser: true, useUnifiedTopology: true },  () => { console.log("mongodb is running...."); });
    }

    setConfig() {
        app.use(express.static("public"));
        app.set("view engine", "ejs");
        app.set("views", path.resolve("resource/view"));

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(validator());
        app.use(session({
            secret: "mySecretKey",
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({ mongooseConnection : mongoose.connection })
        }));

        app.use(cookieParser("mySecretKey"));
        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());
    }

    setRoutes() {
        //app.use(require("app/route/api"));
        app.use(require("app/route/web"));
    }
}