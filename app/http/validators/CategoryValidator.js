const Validator = require('./Validator');
const Category = require('app/model/Category');
const { check } = require('express-validator/check');

class CategoryValidator extends Validator {
  handle() {
    return [
      check("name")
				.isLength({ min: 3, max: 50 })
        .withMessage('طول نام دسته نمی تواند کمتر از  دو کاراکتر و کمتر از پنجاه کاراکتر باشد.')
        .custom(async (value) => {
          const category = await Category.findOne({ name: value });
          if(category){
            throw new Error('نام دسته تکراری است');
          }
          return;
        }),
    ];
  }
}

module.exports = new CategoryValidator();