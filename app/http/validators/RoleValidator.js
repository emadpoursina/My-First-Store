const Validator = require('./Validator');
const { check } = require('express-validator/check');
const Role = require('app/model/Role');

class RoleValidator extends Validator {
  handle(){
    return [
      check('name')
        .isLength({ min: 3, max: 50 })
        .withMessage('طول نام باید بین ۳ تا ۲۰ کاراکتر باشد.')
        .custom(async (value, { req }) => {
          if(req.method === 'PUT') {
            const currentRole = await Role.findById(req.params.id);
            if(currentRole) return;
          }

          const newRole = await Role.findOne({ name: value });
          if(newRole)
            throw new Error('نام نقش نمی تواند تکراری باشد.');
        }),
      check('label')
        .not().isEmpty()
        .withMessage('توضیحات نمی تواند خالی باشد'),
      check('permissions')
        .not().isEmpty()
        .withMessage('قابلیت ها نمی تواند خالی باشد'),
    ];
  }
}

module.exports = new RoleValidator();