const path = require('path');

module.exports = {
    port : process.env.APPLICATION_PORT,
    public_dir: process.env.PUBLIC_DIR,
    view_engine: "ejs",
    view_dir: path.resolve(process.env.VIEW_DIR)
}