const controller = require('./../controller');
const Category = require('app/model/Category');

class CategoryController extends controller {
  async index(req, res, next) {
    try {
      const page = req.query.page | 1;
      const categories = await Category.paginate({}, { page, limit: 10 });
      res.render('admin/category/index', { title: 'دسته ها', categories });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const categories = await Category.find({});
      res.render('admin/category/create', { title: 'ایجاد دسته', categories });
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const status = await this.validateData(req);
      if(!status)
        return this.back(req, res);

      const newCategory = await new Category({
        name: req.body.name,
        parent: req.body.parent !== 'none' ? req.body.parent : null,
      });

      await newCategory.save();

      res.redirect('/admin/categories');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();