const path = require('path');
const expresLayout = require("express-ejs-layouts");

module.exports = {
    port : process.env.APPLICATION_PORT,
    public_dir: process.env.PUBLIC_DIR,
    view_engine: "ejs",
    view_dir: path.resolve(process.env.VIEW_DIR),
    ejs: {
        expresLayout,
        extractScripts: true,
        extractStyles: true,
        masterDir: "home/master",
    }
}