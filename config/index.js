const database = require("./database");
const session = require("./session");
const service = require("./service");
const layout = require("./layout");

module.exports = {
    layout,
    database,
    session,
    service,
    cookieSecretKey: process.env.COOKIE_SECRETKEY
}