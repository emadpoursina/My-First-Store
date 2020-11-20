const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require("passport");
const Helper = require("./Helper");
const rememberLogin = require("app/http/middleware/rememberLogin");
const config = require('../config');
const expresLayout = require("express-ejs-layouts");

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
        server.listen(config.application.port, () => {
            console.log(`Running on port ${config.application.port} ....`);
        });
    }

    setupMongoConnection() {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.database.url, config.database.options, () => {
            console.log(config.database.successMessage)
        });
    }

    setConfig() {
        require("app/passport/passport-local");

        app.use(express.static(config.application.public_dir));
        app.set("view engine", config.application.view_engine);
        app.set("views", config.application.view_dir);
        app.use(expresLayout);
        app.set("layout extractScripts", true);
        app.set("layout extractStyles", true);
        app.set("layout", "home/master");

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(validator());
        app.use(session({...config.session}));

        app.use(cookieParser(config.cookieSecretKey));
        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());
        app.use(rememberLogin.handle);

        app.use((req, res, next) => {
            app.locals = new Helper(req, res).getObject();
            next();
        })
    }

    setRoutes() {
        //app.use(require("app/route/api"));
        app.use(require("app/route/web"));
    }
}