const Controller = require("./../controller");

class ForgotPassword {
    showForgotPassword (req, res){
        const title = "فراموشی رمز عبور";
        res.render("resource/view/home/auth", {errors: req.flash("errors"), recaptch: this.recaptch.render(), title});
    }
}