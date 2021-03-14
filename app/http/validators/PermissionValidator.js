const Validator = require('./Validator');
const { check } = require('express-validator/check');
const Permission = require('app/model/Permission');

class PermissionValidator extends Validator {
  handle() {
    return [
      check('name')
        .isLength({ min: 3, max: 50 })
        .withMessage('طول نام نمی تواند بیشتر از 50 و کمتر از 3 باشد')
        .custom(async (value, { req }) => {
          if(req.method === 'PUT') {
            const oldPermission = await Permission.findById(req.params.id);
            if(oldPermission.name === value) return;
          }

          const permission = await Permission.findOne({ name: value });
          if(permission) {
            throw new Error('نام قابلیت نمی تواند تکراری باشد.');
          }
        }),
        check('label')
        .not().isEmpty()
        .withMessage('فیلد توضیح نمی تواند خالی باشد')
        .isLength({ max: 50 })
        .withMessage('طول توضیح نمی تواند بیش تر از 50 کاراکتر باشید'),
    ];
  }
}

module.exports = new PermissionValidator();