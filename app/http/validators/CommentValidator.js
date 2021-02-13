const Validator = require('./Validator');
const check = require('express-validator/check').check;

class CommentValidator extends Validator {
  handle() {
    return [
      check('comment')
        .isLength({ max: 50 })
        .withMessage('طول کامنت نمی تواند بیشتر از 50 کلمه باشد.')
    ];
  }
}

module.exports = new CommentValidator()