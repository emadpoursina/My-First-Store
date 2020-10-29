const Controller = require("app/http/controller/controller");
const passport = require("passport");

class RegisterController extends Controller {
    showRegistrationForm(req, res) {
        res.render("auth/register.ejs", { message: req.flash("errors"), recaptcha: this.recaptcha.render() });
    }

    registrationProcess(req, res) {
        this.recaptchaValidation(req, res)
            .then((result) => {
                this.dataValidation(req)
                    .then(result => {
                        if(result){
                            this.registerUser(req, res, next);
                        }else{
                            res.redirect("/register");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send("My Error: " + err);
                    })
            })
            .catch((err) => {
                console.log(err);
                res.send("My Error: " + err);
            })
    }

    dataValidation(req, res) {
        req.checkBody("name", 'name field can not be empty.').notEmpty();
        req.checkBody("name", 'name field can not be less than 5 character and more than 50.').isLength({min: 5, max: 50});
        req.checkBody("email", 'email field can not be empty.').notEmpty();
        req.checkBody("email", 'Enter a valid email address').isEmail();
        req.checkBody("password", 'password field can not be empty.').notEmpty();
        req.checkBody("password", 'password field can not be less than 8 character.').isLength({min: 8});

        return req.getValidationResult()
            .then(result => {
                const errors = result.array();
                const message = [];
                errors.forEach(err => {
                   message.push(err.msg); 
                });
                if(message.length > 0){
                    req.flash("errors", message);
                    return false;
                }else{
                    return true;
                }

            })
            .catch(err => {
                console.log(err);
            })
    }

    registerUser(req, res, next) {
        passport.authenticate("local.register", {
            successRedirect: "/",
            failureRedirect: "/register",
            failureFlash: true
        })(req, res, next);
    }
}

module.exports = new RegisterController();