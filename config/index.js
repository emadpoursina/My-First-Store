const application = require("./application");
const database = require("./database");
const session = require("./session");
const service = require("./service");

module.exports = {
    application,
    database,
    session,
    service,
    cookieSecretKey: "mySecretKey"

}