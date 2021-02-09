const Controller = require('./controller');
const Course = require('app/model/Course');
const Episode = require('app/model/Episode');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { time } = require('console');

class CourseController extends Controller {
  index(req, res, next) {
    res.render('home/courses', {title: 'آخرین دوره ها'});
  }

  async single(req, res, next) {
    const course = await Course.findOne({ slug: req.params.course }).populate([{
      path: 'user',
      select: 'name',
    }, {
      path: 'episodes',
      options: { sort: { number: 1 }},
    }]);
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

  async download(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const episode = await Episode.findById(req.params.id);
      if (!episode) {
        return this.error('چنین قسمتی وجود ندارد', 404)
      }

      if(! this.checkHash) this.err('لینک دانلود دیگر معتبر نیست', 403);

      const filePath = `./public/download/${episode.videoUrl}`;
      if(! fs.existsSync(filePath)) this.error('چنین فایلی وجود ندارد.', 404);

      return res.download(filePath);
    }catch(err) {
      next(err);
    }
  }

  checkHash(episode, req) {
    const timeStamps = new Date().getTime();
    if(timeStamps > req.query.t) return false;

    const text = `lsdjflksdjfkldsjf${episode.id}${req.query.t}`;
    return bcrypt.compareSync(text, req.query.mac)
  }
}

module.exports = new CourseController();