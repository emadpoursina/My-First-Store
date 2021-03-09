const Controller = require('./controller');

class UserController extends Controller {
  index(req, res, next) {
   res.render('home/panel/index'); 
  }  
}

module.exports = new UserController();