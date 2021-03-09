const Controller = require('./controller');

class UserController extends Controller {
  index(req, res, next) {
    res.render('home/panel/index', { title: 'پنل کاربری', user: req.user }); 
  }  
}

module.exports = new UserController();