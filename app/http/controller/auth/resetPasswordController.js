const Controller = require("./../controller");
const uniqueString = require("unique-string");
const PasswordReset = require("app/model/password-reset");
const User = require("app/model/user");

class ResetPasswordController extends Controller {
    showResetPassword (req, res){
        const title = "بازیابی رمز عبور";
        res.render("home/auth/password/resetPassword.ejs", {errors: req.flash("errors") ,success: req.flash("success"),  recaptcha: this.recaptcha.render(), title});
    }

    async resetPasswordProccess(req, res){
        let result = await this.recaptchaValidation(req, res);
        if (!result){
            res.redirect("/auth/password/reset");
        }

        result = await this.validateData(req);
        if (!result){
            res.redirect("/auth/password/reset");
        }

        return resetPassword(req, res);
    }

    async resetPassword(req, res) {
        const resetRequest = await PasswordReset.findOne({
            $and: [{email: req.body.email}, {token: req.body.token}]
        });
        if(!resetRequest) {
            req.flash("errors", "چنین درخواستی ثبت نشده است");
            return this.back(req, res);
        }

        if(resetRequest.use) {
            req.flash("errors", "از این لینک قبلا استفاده شده است");
            return this.back(req, res);
        }

        const user = await User.findOneAndUpdate({
                email: resetRequest.email
            },{
                $set: {
                    password: req.body.password
                }
            });
        if(!user) {
            req.flash("errors", "چنین کاربری وجود ندارد");
            return this.back(req, res);
        }

        await resetRequest.update({ use: true });
        return res.redirect("/auth/login");
    }
}

module.exports = new ResetPasswordController();