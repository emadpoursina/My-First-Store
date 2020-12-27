const Controller = require("app/http/controller/controller");
const passport = require("passport");

class RegisterController extends Controller {
    showRegistrationForm(req, res) {
        res.render("home/auth/register.ejs", { recaptcha: this.recaptcha.render(), title: "Register" });
    }

    registrationProcess(req, res, next) {
        this.recaptchaValidation(req, res)
            .then(() => this.validateData(req))
            .then(result => {
                if(result) this.registerUser(req, res, next);
                else res.redirect("/auth/register");
            })
            .catch(err => console.log(err))
    }

    registerUser(req, res, next) {
        passport.authenticate("local.register", {
            successRedirect: "/",
            failureRedirect: "/auth/register",
            failureFlash: true
        })(req, res, next);
    }
}

module.exports = new RegisterController();