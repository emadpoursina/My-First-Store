const { check } = require("express-validator/check");
const Validator = require("./Validator");

class ForgotPasswordValidator extends Validator{
    handle (){
        return [
            check("email")
                .isEmail()
                .withMessage("ایمیل معتبر نیست")
        ]

    }
}

module.exports = new ForgotPasswordValidator();