const Controller = require('../controller');

class UserController extends Controller {
  index(req, res, next) {
    try {
      res.render('admin/users/index');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();