const Controller = require("./../controller");

class ForgotPasswordController extends Controller {
    showForgotPassword (req, res){
        const title = "فراموشی رمز عبور";
        res.render("home/auth/password/forgotPassword.ejs", {errors: req.flash("errors"),  recaptcha: this.recaptcha.render(), title});
    }
}

module.exports = new ForgotPasswordController();