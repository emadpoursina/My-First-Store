const Middleware = require('./middleware');

class RedirectIfNotAuthenticated extends Middleware {
  handle(req, res, next) {
    if(!req.isAuthenticated()) {
      res.redirect('/auth/login');
    }else {
      next();
    }
  }
}

module.exports = new RedirectIfNotAuthenticated();