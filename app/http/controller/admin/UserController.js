const Controller = require('../controller');

class UserController extends Controller {
  index(req, res, next) {
    try {
      
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();