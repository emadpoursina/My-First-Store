const Controller = require("app/http/controller/controller.js");
const passport = require("passport");

class LoginController extends Controller {
    showLoginForm(req, res) {
        res.render("auth/login.ejs", { errors: req.flash("errors"), recaptcha: this.recaptcha.render() });
    }

    loginProcess(req, res) {
        this.recaptchaValidation(req, res)
            .then( (result) => {
                this.dataValidation(req, res)
                    .then( (result) => {
                        if(result) {
                            this.loginUser(req, res);
                        }else{
                            res.redirect("/login");
                        }
                    })
                    .catch( (err) => {
                        console.log(err);
                        res.send(err);
                    })
            })
            .catch( (err) => {
                console.log(err);
                res.send(err);
            })
    }

    dataValidation(req) {
        req.checkBody("email", "Enter a valid Email.").isEmail();
        req.checkBody("password", 'password field can not be empty.').notEmpty();

        return req.getValidationResult()
            .then( (result) => {
                const errors = result.array();
                const message = [];
                errors.forEach(error => {
                   message.push(error.msg);
                });

                if(message.length > 0) {
                    req.flash("errors", message);
                    return false;
                }else {
                    return true;
                }
            })
            .catch( (err) => {
                console.log(err);
                res.send(err);
            })
    }

    loginUser(req, res){
        passport.authenticate("local.login", {
            successRedirect: "/",
            failureRedirect: "/login",
            failureFlash: true
        })(req, res)
    }
}

module.exports = new LoginController();