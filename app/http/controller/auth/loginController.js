const Controller = require("app/http/controller/controller.js");
const passport = require("passport");

class LoginController extends Controller {
    showLoginForm(req, res) {
        res.render("auth/login.ejs", { errors: req.flash("errors"), recaptcha: this.recaptcha.render() });
    }

    loginProcess(req, res) {
        this.recaptchaValidation(req, res)
            .then( (result) => {
                this.validateData(req)
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

    loginUser(req, res){
        passport.authenticate("local.login", (err, user) => {
            if (!user){
                return res.redirect("/login");
            }

            req.logIn(user, (err) => {
                if (req.body.remember) {
                    user.setRememberToken(res);
                }
                res.redirect("/");
            });
        })(req, res)
    }
}

module.exports = new LoginController();