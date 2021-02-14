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
}

module.exports = new CategoryController();