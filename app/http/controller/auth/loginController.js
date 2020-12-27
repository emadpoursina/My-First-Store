const Controller = require("app/http/controller/controller.js");
const passport = require("passport");

class LoginController extends Controller {
    showLoginForm(req, res) {
        res.render("home/auth/login.ejs", { recaptcha: this.recaptcha.render(), title: "Login" });
    }

    loginProcess(req, res) {
        this.recaptchaValidation(req, res)
            .then( () => {
                this.validateData(req)
                    .then( (result) => {
                        if(result) {
                            this.loginUser(req, res);
                        }else{
                            res.redirect("/auth/login");
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
                return res.redirect("/auth/login");
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