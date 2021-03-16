const Controller = require('../controller');
const User = require('app/model/user');
const Comment = require('app/model/Comment');
const Payment = require('app/model/Payment');
const Roles = require('app/model/Role');

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
      users = await User.paginate(query, { page, limit: 20, populate: 'roles' });

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

      const comments = await Comment.find({ user: user._id })
      comments.forEach(comment => {
        comment.set({ user: '6039aa0f6b83b6959ed5ab04' })
        comment.save();
      });

      const payments = await Payment.find({ user: user._id })
      payments.forEach(payment => {
        payment.set({ user: '6039aa0f6b83b6959ed5ab04' })
        payment.save();
      })

      user.courses.forEach(course => {
        course.set({ user: '6039aa0f6b83b6959ed5ab04' });
        course.save();
      });
      await user.remove();

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

  async addrole(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const roles = await Roles.find();
      const roleOptions = this.makeOptions(roles, 'label', '_id', true);
      const user = await User.findById(req.params.id);
      if(!user) return this.error('چنین کاربری وجود ندارد', 404);

      res.render('admin/users/addrole', { title: 'نقش دادن', user, roles: roleOptions });
    } catch (error) {
      next(error);
    }
  }

  async storeRoleForUser(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const user = await User.findById(req.params.id);
      if(!user) return this.error('چنین کاربری وجود ندارد', 404);
      req.body.roles = req.body.roles.split(',');

      user.set({ roles: req.body.roles });
      await user.save();

      res.redirect('/admin/users/');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();