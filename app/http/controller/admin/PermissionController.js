const Controller = require('../controller');
const Permission = require('app/model/Permission');

class PermissionController extends Controller {
  async index(req, res, next) {
    try {
      const page = req.query.page || 1;
      const permissions = await Permission.paginate({}, { page, limit: 20 });

      res.render('admin/permissions/index', { title: 'قابلیت ها', permissions});
    } catch (error) {
      next(error);
    }
  }

  create(req, res, next) {
    try {
      res.render('admin/permissions/create', { title: 'ایجاد قابلیت جدید' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PermissionController();