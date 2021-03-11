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

  async toggleAdmin(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const user = await User.findById(req.params.id);
      if(!user) this.error('چنین کاربری وجود خارجی ندارد.', 404);

      user.set({ admin: !user.admin});
      user.save();

      res.redirect('/admin/users');
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const user = await User.findById(req.params.id).populate('courses');
      if(!user) this.error('چنین کاربری وجود ندارد', 404);

      user.courses.forEach(course => {
        course.set({ user: 'null' });
        course.save();
      });
      user.remove();

      res.redirect('/admin/users');
    }catch(error) {
      next(error);
    }
  }

}

module.exports = new UserController();