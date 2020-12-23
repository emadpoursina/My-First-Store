const Controller = require("./../controller");
const uniqueString = require("unique-string");
const PasswordReset = require("app/model/password-reset");
const User = require("app/model/user");

class ResetPasswordController extends Controller {
    showResetPassword (req, res){
        const title = "بازیابی رمز عبور";
        res.render("home/auth/password/resetPassword.ejs", {
            errors: req.flash("errors"),
            success: req.flash("success"),
            recaptcha: this.recaptcha.render(),
            token: req.params.token,
            title});
    }

    async resetPasswordProccess(req, res){
        await this.recaptchaValidation(req, res);
        const result = await this.validateData(req);
        if (!result){
            res.redirect("/auth/password/reset/" + req.body.token);
        }

        return this.resetPassword(req, res);
    }

    async resetPassword(req, res) {
        const token = req.body.token;
        const resetRequest = await PasswordReset.findOne({
            $and: [{email: req.body.email}, {token: token.trim()}]
        });
        if(!resetRequest) {
            req.flash("errors", "چنین درخواستی ثبت نشده است");
            return this.back(req, res);
        }

        if(resetRequest.use) {
            req.flash("errors", "از این لینک قبلا استفاده شده است");
            return this.back(req, res);
        }

        const user = await User.findOne({email: resetRequest.email});

        if(!user) {
            req.flash("errors", "چنین کاربری وجود ندارد");
            return this.back(req, res);
        }

        user.password = req.body.password;
        await user.save();

        await resetRequest.update({ use: true });
        return res.redirect("/auth/login");
    }
}

module.exports = new ResetPasswordController();