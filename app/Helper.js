const path = require("path");

module.exports = class Helper {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    // get the global object
    getObject() {
        return {
            auth: this.auth(),
            viewPath: this.viewPath,
        };
    }

    auth() {
        return {
            user: this.req.user,
            check: this.req.isAuthenticated()
        }
    }

    viewPath(dir) {
        return path.resolve(config.layout.view_dir + "/" + dir);
    }
}