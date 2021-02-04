const Controller = require('./controller');

class CourseController extends Controller {
  index(req, res, next) {
    res.render('home/courses', {title: 'آخرین دوره ها'});
  }
}

module.exports = new CourseController();