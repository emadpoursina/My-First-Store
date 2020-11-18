const path = require('path');

module.exports = {
    port: 3000,
    public_dir: "public",
    view_engine: "ejs",
    view_dir: path.resolve("resource/view")
}