const Controller = require('./controller');
const Payment = require('app/model/Payment');
const axios = require('axios');

class UserController extends Controller {
  index(req, res, next) {
    res.render('home/panel/index', { title: 'پنل کاربری', user: req.user }); 
  }

  async history(req, res, next) {
    const payments = await Payment.find({ user: req.user._id }).populate('product');

    res.render('home/panel/history', { title: 'پنل کاربری', payments})
  }

  async vip(req, res, next) {
    try {
      return res.render('home/panel/vip');
    } catch (error) {
      next(error);
    }
  }

  payment(req, res, next) {
    try {
      // Redirect user to payment gate
      const data = {
        merchant_id: 'd53a145f-b2c5-4dc5-afc0-cced9493aecf',
        amount: this.getVipPrice(req.body.plan),
        callback_url: 'http://localhost:3000/vip/payment/checker',
        description: `افزایش اعتبار عضویت ویژه`,
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
      .then(async (response) => {
        const data = response.data.data;
        if(data.code === 100) {
          const payment = new Payment({
            user: req.user._id,
            vip: true,
            price: this.getVipPrice(req.body.plan),
            status: 100,
            resNumber: data.authority,
          });
          await payment.save();
          return res.redirect(`https://www.zarinpal.com/pg/StartPay/${data.authority}`);
        }
        
        return this.error(response.data.error);
      })
      .catch(error => next(error));
    } catch (error) {
      next(error);
    }
  }

  async paymentCheck(req, res, next) {
    try {
      const { Authority, Status } = req.query;

      // Check the request status 
      if(Status && Status !== 'OK') {
        this.sweetAlert(req, {
          title: 'نتیجه پرداخت',
          text: 'پرداخت شما با موفقیت انجام نشد',
          icon: 'error',
          time: 1000,
        })
        return this.back(req, res);
      }

      // Check payment existence in the database
      const payment = await Payment.findOne({ resNumber: Authority });
      if(!payment) {
        this.sweetAlert(req, {
          title: 'نتیجه خرید شما',
          text: 'چنین پرداختی در دیتا بیس وجود ندارد',
          icon: 'error',
          time: 2000,
        });
        return this.back(req, res);
      }

      // Authenticating request
      const data = {
        merchant_id: 'd53a145f-b2c5-4dc5-afc0-cced9493aecf',
        amount: payment.price,
        authority: Authority,
      };

      const requestHeader = {
        'contetn-type': 'application/json',
        'cache-control' : 'no-cache',
      };

      axios({
        method: 'post',
        url: 'https://api.zarinpal.com/pg/v4/payment/verify.json',
        headers: requestHeader,
        data,
      })
      .then(async (response) => {
      const data = response.data.data;
      if(data.Status === 100) {
          payment.status = 200;

          // Increse user vip time
          let time = 0;

          switch (payment.price) {
            case 30000:
              time = 3
              break;
            case 120000:
              time = 12;
              break;
            default:
              time = 1;
              break;
          }

          // Calculate and set vip time
          const vipTime = req.user.isVip() ? new Date(req.user.vipTime) : new Date();
          vipTime.setMonth( vipTime.getMonth() + time);
          req.user.vipTime = vipTime;

          await req.user.save();
          await payment.save();

          this.sweetAlert(req, {
            title: 'نتیجه خرید شما',
            text: 'خرید شما با موفقیت انجام شد.',
            icon: 'success',
            time: '2000',
          });
          res.redirect('/user/panel');
        }else {
          this.sweetAlert(req, {
            title: 'وضعیت خرید شما',
            text: 'خرید شما با موفقیعت انجام نشد.',
            icon: 'error',
            time: 3000,
          });
          return this.back(req, res);
        }
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          //console.log(error.response.headers);
          return next(new Error(error.response.data.errors.message + ':' + error.response.status));
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
          return next(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          return next('Error', error.message);
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();