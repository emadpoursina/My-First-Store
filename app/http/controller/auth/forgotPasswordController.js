const Controller = require("./../controller");
const uniqueString = require("unique-string");
const PasswordReset = require("app/model/password-reset");

class ForgotPasswordController extends Controller {
    showForgotPassword (req, res){
        const title = "فراموشی رمز عبور";
        res.render("home/auth/password/forgotPassword.ejs", {errors: req.flash("errors"),  recaptcha: this.recaptcha.render(), title});
    }

    async sendPasswordResetLink (req, res){
        await this.recaptchaValidation();
        const result = await this.validateData(req);
        if (!result){
            res.redirect("/auth/password/reset");
        }

        return res.sendResetLink(req);
    }

}

module.exports = new ForgotPasswordController();