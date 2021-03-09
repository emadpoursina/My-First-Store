const Controller = require('./controller');

class UserController extends Controller {
  index(req, res, next) {
    res.render('home/panel/index', { title: 'پنل کاربری', user: req.user }); 
  }

  history(req, res, next) {
    res.render('home/panel/history', { title: 'پنل کاربری'})
  }
}

module.exports = new UserController();