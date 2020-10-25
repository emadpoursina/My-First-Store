const Controller = require("app/http/controller/controller");

class RegisterController extends Controller {
    showRegistrationForm(req, res) {
        res.render("auth/register.ejs", { message: req.flash("errors")});
    }

    registrationProcess(req, res) {
        this.dataValidation(req, res)
            .then(result => {
                if(result){
                    res.send('Registered Successfully! ');
                }else{
                    res.redirect("/register");
                }
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
}

module.exports = new RegisterController();