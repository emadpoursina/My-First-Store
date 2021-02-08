const Controller = require('./controller');
const Course = require('app/model/Course');

class CourseController extends Controller {
  index(req, res, next) {
    res.render('home/courses', {title: 'آخرین دوره ها'});
  }

  async single(req, res, next) {
    const course = await Course.findOne({ slug: req.params.course }).populate(['user', 'episodes']);
    const canUserUse = await this.canUse(req, course);
    res.render('home/single-course.ejs', {title: course.title, course, canUserUse})
  }

  async canUse(req, course) {
    let canUse = false;
    if(req.isAuthenticated()){
      switch (course.type) {
        case 'vip':
          canUse = req.user.isVip();
          break;
        case 'cash':
          canUse = req.user.checkLearning(course);
          break;
        default:
          canUse = req.user.checkLearning(course);
          break;
        }
    }
    return canUse;
  }

}

module.exports = new CourseController();