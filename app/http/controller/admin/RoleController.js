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

  async store(req, res, next) {
    try {
      const result = this.validateData(req);
      if(!result) return this.back(req, res); 

      req.body.permissions = req.body.permissions.split(',');

      const newRole = new Role(req.body);
      await newRole.save();

      res.redirect('/admin/users/roles');
    } catch (error) {
      next(error);
    }
  }

  async index(req, res, next) {
    try {
      const page = req.query.page || 1;
      const roles = await Role.paginate({}, { page, limit: 20 });

      res.render('admin/roles/index', { title: 'نقش ها', roles });
    } catch (error) {
      next(error);
    }
  }

  
  async edit(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const permissions = await Permission.find();
      const permissonOptions = this.makeOptions(permissions, 'label', '_id', true);

      const role = await Role.findById(req.params.id);
      if(!role) this.error('چنین نقشی وجود ندارد', 404);

      res.render('admin/roles/edit', { title: 'ویرایش نقش', role, permissions: permissonOptions});
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const result = this.validateData(req);
      if(!result) return this.back(req, res);

      const role = await Role.findById(req.params.id);
      if(!role) return this.error('چنین نقشی وجود ندارد', 404);

      req.body.permissions = req.body.permissions.split(',');

      Object.keys(req.body).forEach(key => {
        role[key] = req.body[key];
      });

      await role.save();

      res.redirect('/admin/users/roles');
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const role = await Role.findById(req.params.id);
      if(!role) return this.error('چنین نقشی وجود ندارد', 404);

      await role.remove();

      res.redirect('/admin/users/roles');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoleController();