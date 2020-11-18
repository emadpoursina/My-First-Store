require('dotenv').config();
require("app-module-path").addPath(__dirname);
const App = require("app/index.js");
global.config = require("./config");

new App();
