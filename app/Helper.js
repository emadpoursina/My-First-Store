module.exports = class Helper {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    // get the global object
    getObject() {
        return {
            auth: this.auth()
        };
    }

    auth() {
        return {
            user: this.req.user,
            check: this.req.isAuthenticated()
        }
    }
}