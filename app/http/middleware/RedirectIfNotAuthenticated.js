const Middleware = require('./middleware');

class RedirectIfNotAuthenticated extends Middleware {
  handle(req, res) {
    if(!req.isAuthenticated()) {
      res.redirect('/login');
    }else {
      next();
    }
  }
}

module.exports = new RedirectIfNotAuthenticated();