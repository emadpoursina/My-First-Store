const Controller = require("./../controller");
const uniqueString = require("unique-string");
const PasswordReset = require("app/model/password-reset");
const User = require("app/model/user");

class ResetPasswordController extends Controller {
    showResetPassword (req, res){
        const title = "فراموشی رمز عبور";
        res.render("home/auth/password/resetPassword.ejs", {errors: req.flash("errors") ,success: req.flash("success"),  recaptcha: this.recaptcha.render(), title});
    }

    async sendPasswordResetLink (req, res){
        let result = await this.recaptchaValidation(req, res);
        if (!result){
            res.redirect("/auth/password/reset");
        }

        result = await this.validateData(req);
        if (!result){
            res.redirect("/auth/password/reset");
        }
    }
}

module.exports = new ResetPasswordController();