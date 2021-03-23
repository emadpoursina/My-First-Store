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

}

module.exports = new UserController();