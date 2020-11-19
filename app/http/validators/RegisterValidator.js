const Validator = require("./Validator");
const { check } = require("express-validator/check");

class RegisterValidator extends Validator{
    handle(){
        return [
            check("name")
                .isLength({ min: 5 })
                .withMessage("Name should be at leaset 5 charachter long."),
            check("email")
                .isEmail()
                .withMessage("Enter a valid email address."),
            check("password")
                .isLength({ min: 8 })
                .withMessage("Password should be at least 8 charachter long."),
        ]
    }
}


module.exports = new RegisterValidator();