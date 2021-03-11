const Validator = require('./Validator');
const { check } = require('express-validator/check');

class UserValidator extends Validator {
  handle(req, res) {
    return [
      check('name')
        .isLength({ max: 10 })
        .withMessage('طول نام نمی تواند بیشتر از 10 کاراکتر باشد.'),
      check('email')
        .isLength({ max: 50 })
        .withMessage('طول ایمیل نمی تواند بیشتر از 10 کاراکتر باشد.'),
      check('password')
        .isLength({ min: 5 })
        .withMessage('طول رمز عبور نمی تواند کم تر از 5 کاراکتر باشد.'),
    ];
  }
}

module.exports = new UserValidator();