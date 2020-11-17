const Middleware = require("./middleware");
const User = require("app/model/user.js");

class RememberLogin extends Middleware {
    handle(req, res, next) {
        if(! req.isAuthenticated()){
            const rememerToken = req.signedCookies.remember_token;
            if(rememerToken) {
                return this.usreFind(rememerToken, req, next);
            }
        }
        next();
    }

    async usreFind(rememberToken, req, next) {
        await User.findOne({ remember_token: rememberToken })
            .then(user => {
                if(user) {
                    req.logIn(user, err => {
                        if(err)
                            next(err);
                        next()
                    })
                }
                next();
            })
            .catch(err => {
                next(err);
            })
    }
}

module.exports = new RememberLogin();