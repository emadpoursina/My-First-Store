const middleware = require("./middleware");

class RedirectIfNotAdmin extends middleware{
    handle(req, res, next) {
        if(req.isAuthenticated() && req.user.admin)
            return next();
        return res.redirect("/");
    }
}

module.exports = new RedirectIfNotAdmin();