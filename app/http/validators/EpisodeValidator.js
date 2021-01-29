const Validator = require('./Validator');
const {check} = require('express-validator/check');
const Episode = require('app/model/Episode');

class EpisodeValidator extends Validator {
  handle() {
    return [
      check('title')
        .isLength({ min : 5, max: 50 })
        .withMessage('عنوان نمیتواند کمتر از 5 کاراکتر باشد'),

      check('type')
        .not().isEmpty()
        .withMessage('فیلد نوع دوره نمیتواند خالی بماند'),

      check('course')
        .not().isEmpty()
        .withMessage('فیلد دوره مربوطه نمیتواند خالی بماند'),

      check('body')
        .isLength({ min : 5, max: 300 })
        .withMessage('متن دوره نمیتواند کمتر از 20 کاراکتر باشد'),

      check('videoUrl')
        .not().isEmpty()
        .withMessage(' لینک دانلود نمیتواند خالی بماند')
        .custom(async (value, { req }) => {
          const episode = await Episode.findOne({ videoUrl: value });
          if(episode) {
            if(req.query._method === 'PUT' && episode._id == req.params.id) {
              return true;
            }
            throw new Error('ویدیو تکراری است');
          }
          return true;
        }),

      check('number')
        .not().isEmpty()
        .withMessage('شماره جلسه نمیتواند خالی بماند'),
    ];
  }
}

module.exports = new EpisodeValidator();