const Validator = require('./Validator');
const { check } = require('express-validator/check');
const User = require('app/model/user');

class UserValidator extends Validator {
  handle(req, res) {
    return [
      check('name')
        .isLength({ max: 20, min: 3 })
        .withMessage('طول نام نمی تواند کم تر از ۳ و بیشتر از 20 کاراکتر باشد.'),
      check('email')
        .isLength({ max: 50 })
        .withMessage('طول ایمیل نمی تواند بیشتر از 10 کاراکتر باشد.')
        .custom(async (value) => {
          const user = await User.findOne({ email: value });
          if(user)
            throw new Error('این ایمیل تکرار ی است.');
        }),
      check('password')
        .isLength({ min: 5 })
        .withMessage('طول رمز عبور نمی تواند کم تر از 5 کاراکتر باشد.'),
    ];
  }
}

module.exports = new UserValidator();