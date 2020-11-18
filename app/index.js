const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require("passport");
const Helper = require("./Helper");
const rememberLogin = require("app/http/middleware/rememberLogin");
const { urlencoded } = require('body-parser');
const config = require('../config');

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
        mongoose.connect("mongodb://localhost/frosh2D", { useNewUrlParser: true, useUnifiedTopology: true },  () => { console.log("mongodb is running...."); });
    }

    setConfig() {
        require("app/passport/passport-local");

        app.use(express.static(config.application.public_dir));
        app.set("view engine", config.application.view_engine);
        app.set("views", config.application.view_dir);

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(validator());
        app.use(session({
            secret: "mySecretKey",
            resave: true,
            cookie:{ expires: 1000 * 60 * 60 * 5 },
            saveUninitialized: true,
            store: new MongoStore({ mongooseConnection : mongoose.connection })
        }));

        app.use(cookieParser("mySecretKey"));
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