const Controller = require('../controller');
const User = require('app/model/user');

class UserController extends Controller {
  async index(req, res, next) {
    try {
      const query = {};
      let users = [];

      const {word, admin} = req.query;

      if(word) {
        query.$or = [
            { email: { $regex: `.*${word}.*` } },
            { name: { $regex: `.*${word}.*` } },
          ];
      }

      if(admin === "1")
        query.admin = true;

      const page = req.query.page || 1;
      users = await User.paginate(query, { page, limit: 20 });

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
        course.set({ user: '6039aa0f6b83b6959ed5ab04' });
        course.save();
      });
      user.remove();

      res.redirect('/admin/users');
    }catch(error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      res.render('admin/users/create');      
    }catch(error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const result = await this.validateData(req);
      if(!result) {
        return this.back(req, res);
      }

      const newUser = new User({
        ...req.body,
      });

      await newUser.save();

      return res.redirect('/admin/users');
    }catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();