const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require("passport");
const Helper = require("./Helper");
const rememberLogin = require("app/http/middleware/rememberLogin");
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
        server.listen(config.layout.port, () => {
            console.log(`Running on port ${config.layout.port} ....`);
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
        require("app/passport/passport-google");

        app.use(express.static(config.layout.public_dir));
        app.set("view engine", config.layout.view_engine);
        app.set("views", config.layout.view_dir);

        app.set("layout extractScripts", config.layout.ejs.extractScripts);
        app.set("layout extractStyles", config.layout.ejs.extractStyles);
        app.use(config.layout.ejs.expresLayout);
        app.set("layout", config.layout.ejs.masterDir);

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(methodOverride('_method'));

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