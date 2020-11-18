const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

module.exports = {
    secret: "mySecretKey",
    resave: true,
    cookie:{ expires: 1000 * 60 * 60 * 5 },
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection : mongoose.connection })
}   