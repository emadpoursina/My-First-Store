const Controller = require('../controller');
const User = require('app/model/user');

class UserController extends Controller {
  async index(req, res, next) {
    try {
      const page = req.query.page || 1;
      const users = await User.paginate({}, { page, limit: 20 });

      res.render('admin/users/index', { title: 'کاربران', users});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();