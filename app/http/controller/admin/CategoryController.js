const controller = require('./../controller');
const Category = require('app/model/Category');
const { populate } = require('../../../model/Category');

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

  async edit(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const category = await Category.findById(req.params.id);
      const categories = await Category.find({});
      if(!category) this.error('چنین دسته ای وجود ندارد.', 404);

      return res.render('admin/category/edit', { title: 'ویرایش دسته', category, categories });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const result = this.validateData(req);
      if(!result) return this.back(req, res);

      const category = await Category.findById(req.params.id);
      if(!category) this.error('چنین دسته ای وجود ندارد.');
      if(String(req.body.parent) === String(category._id)) this.error('هیچ دسته ای نمی تواند زیر مجموعه خودش باشد.', 403);

      category.name = req.body.name;
      if(req.body.parent === 'none')
        category.parent = null;
      else
        category.parent = req.body.parent;

      await category.save();

      res.redirect('/admin/categories/');
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const category = await Category.findById(req.params.id)
        .populate(['childs']);
      if(!category) this.error('چینین دوره ای وجود ندارد.', 404);

      if(category.childs.length > 0){
        category.childs.forEach(child => {
          child.parent = null;
          child.save();
        });
      }

      category.remove();

      res.redirect('/admin/categories/');
    } catch (error) {
      next(error);
    }
  }

  /**
   *  Turn title to a valid url 
   * @param {String} title 
   */
  slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
  }
}

module.exports = new CategoryController();