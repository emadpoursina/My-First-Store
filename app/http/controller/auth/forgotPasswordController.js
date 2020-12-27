const Controller = require("./../controller");
const uniqueString = require("unique-string");
const PasswordReset = require("app/model/password-reset");
const User = require("app/model/user");

class ForgotPasswordController extends Controller {
    showForgotPassword (req, res){
        const title = "فراموشی رمز عبور";
        res.render("home/auth/password/forgotPassword.ejs", {success: req.flash("success"),  recaptcha: this.recaptcha.render(), title});
    }

    async sendPasswordResetLink (req, res){
        await this.recaptchaValidation(req, res);
        const result = await this.validateData(req);
        if (!result){
            res.redirect("/auth/password/reset");
        }

        return this.sendResetLink(req, res);
    }

    async sendResetLink (req, res){
        const user = await User.findOne({ "email": req.body.email })
        if (!user){
            req.flash("errors", "چنین کاربری وجود ندارد.");
            return this.back(req, res);
        }

        await new PasswordReset({
            email: req.body.email,
            token: uniqueString()
        }).save();;

        req.flash("success", "ایمیل برای شما ارسال شد");
        return res.redirect("/auth/password/reset");

    }
}

module.exports = new ForgotPasswordController();