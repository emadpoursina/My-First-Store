const controller = require('./../controller');
const Role = require('app/model/Role');
const Permission = require('app/model/Permission');

class RoleController extends controller {
  async create(req, res, next) {
    try {
      const permissions = await Permission.find();
      const permissionOptions = this.makeOptions(permissions, 'label', '_id', true );

      res.render('admin/roles/create', { title: 'ویرایش نقش', permissions: permissionOptions });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoleController();