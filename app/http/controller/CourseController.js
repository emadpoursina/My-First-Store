const Controller = require('./controller');
const Course = require('app/model/Course');
const Episode = require('app/model/Episode');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Category = require('app/model/Category');

class CourseController extends Controller {
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @returns Site course list in an array
   */
  async index(req, res, next) {
    try {
      const query = {};
      let courses;

      const { search, type, category, order} = req.query;

      if(search)
        query.title = new RegExp(search, 'gi');

      if(type && type !== 'all')
        query.type = new RegExp(type, 'gi');

      if(category && category !== 'all'){
        const dbCategory = await Category.findOne({ slug: category });
        if(dbCategory) {
          query.categories =  dbCategory._id;
        }else {
          return this.error('چنین دسته ای وجود ندارد.', 404);
        }
      }

      if(order === '1')
        courses = await Course.find({ ...query }).sort({ createdAt: 1 });
      else
        courses = await Course.find({ ...query });

      const categories = await Category.find({});

      res.render('home/courses', {title: 'آخرین دوره ها', courses, categories});
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send Course info to single-course view
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  async single(req, res, next) {
    try {
      const course = await Course.findOneAndUpdate({ slug: req.params.course }, { $inc: { viewCount: 1}}, { useFindAndModify: false }).populate([{
        path: 'user',
        select: 'name',
      }, {
        path: 'episodes',
        options: { sort: { number: 1 }},
      }, {
        path: 'comments',
        match: {
          approved: true,
          parent: null,
        },
        populate : [{
          path: 'user',
          select: 'name',
        },{
            path : 'childs',
            match : {
              approved : true
            },
            populate: [{
              path: 'user',
              select: 'name',
            }]
          }
        ]
      }]);
      if(!course) this.error('چنین دوره ای وجود ندارید.', 404);

      const categories = await Category.find({ parent : null }).populate('childs');

      const canUserUse = await this.canUse(req, course);
      res.render('home/single-course.ejs', {title: course.title, course, canUserUse, categories})
    } catch (error) {
      next(error);  
    }
  }

  /**
   * 
   * @param {*} req 
   * @param {Course model} course 
   * @returns True if user can see course videos and false otherwise
   */
  async canUse(req, course) {
    let canUse = false;
    if(req.isAuthenticated()){
      switch (course.type) {
        case 'vip':
          canUse = req.user.isVip();
          break;
        case 'cash':
          canUse = req.user.checkLearning(course._id);
          break;
        default:
          canUse = req.user.checkLearning(course._id);
          break;
        }
    }
    return canUse;
  }

  /**
   *  Run when ever user wants to download an video episode 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @returns Download link if user can download the episode
   */
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

      await Episode.update({ _id: episode._id }, { $inc: { downloadCount: 1 }});

      return res.download(filePath);
    }catch(err) {
      next(err);
    }
  }

  /**
   * 
   * @param {Episode model} episode 
   * @param {*} req 
   * @returns True if user download link is valid
   */
  checkHash(episode, req) {
    const timeStamps = new Date().getTime();
    if(timeStamps > req.query.t) return false;

    const text = `lsdjflksdjfkldsjf${episode.id}${req.query.t}`;
    return bcrypt.compareSync(text, req.query.mac)
  }

  /**
   * Buying course process  
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  async payment(req, res, next) {
    try {
      const courseId = req.body.course_id;

      this.isMongoId(courseId);

      const course = await Course.findById(courseId);
      if(!course) this.error('چنین دوره ای وجود ندارد.', 404);

      if(req.user.checkLearning(req)) this.error('شما قبلا در این دوره ثبت نام کرده اید.', 403);
     
      if(course.price === 0 && course.type === 'vip') this.error('این دوره مخصوص اعضا ویژه است.', 403);

      if(course.price === 0 && course.type === 'free') {
        // Free course buy process
      }

      // Cash course buy process
      res.end('Thank you page');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CourseController();