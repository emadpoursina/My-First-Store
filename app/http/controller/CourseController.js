const Controller = require('./controller');
const Course = require('app/model/Course');
const Episode = require('app/model/Episode');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Category = require('app/model/Category');
const axios = require('axios').default;
const Payment = require('app/model/Payment');

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
      // Redirect user to payment gate
      const data = {
        merchant_id: 'd53a145f-b2c5-4dc5-afc0-cced9493aecf',
        amount: course.price,
        callback_url: 'http://localhost:3000/courses/payment/checker',
        description: `خرید دوره: ${course.title}`,
        metadata: {
          email: req.user.email,
        }
      };
      const requestHeader = {
        'contetn-type': 'application/json',
        'cache-control' : 'no-cache',
      };
      axios({
        method: 'post',
        headers: requestHeader,
        url: 'https://api.zarinpal.com/pg/v4/payment/request.json',
        data,
      })
      .then((response) => {
        const data = response.data.data;
        if(data.code === 100) {
          const payment = new Payment({
            user: req.user._id,
            product: course._id,
            price: course.price,
            status: 100,
            resNumber: data.authority,
          });
          payment.save();
          return res.redirect(`https://www.zarinpal.com/pg/StartPay/${data.authority}`);
        }
        
        return this.error(response.data.error);
      })
      .catch(error => next(error));
    } catch (err) {
      next(err);
    }
  }

  async checker(req, res, next) {
    try {
      const { Authority, Status } = req.query;

      // Redirect if thereis error
      if(Status && Status !== 'Ok') {
        this.sweetAlert(req, {
          title: 'وضعیت سفارش شما',
          text: 'پرداخت با موفقیت انجام نشد.',
          icon: 'error',
          time: 1000,
        });
        return this.back(req, res);
      }

      // Check if payment is in database and is real or not
      const payment = await Payment.findOne({ resNumber: Authority }).populate('user');
      if(!payment) {
        this.sweetAlert(req, {
          title: 'وضعیت سفارش شما',
          text: 'چنین پرداختی در دیتابیس وجود ندارد.',
          icon: 'error',
          time: 3000,
        });
        return this.back(req, res);
      }

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();