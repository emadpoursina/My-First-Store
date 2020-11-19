const Validator = require("./Validator");
const { check } = require("express-validator/check");

class LoginValidator extends Validator {
    handle(){
        return [
            check("email")
                .isEmail().withMessage("Enter a valid email address."),
            check("password")
                .isLength({ min: 8 }).withMessage("Password should be at least 8 charachter long."),
        ]
    }
}


module.exports = new LoginValidator();