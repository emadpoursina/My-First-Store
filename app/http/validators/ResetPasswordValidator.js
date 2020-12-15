const { check } = require("express-validator/check");
const Validator = require("./Validator");

class ResetPasswordValidator extends Validator{
    handle (){
        return [
            check("email")
                .isEmail()
                .withMessage("ایمیل معتبر نیست"),
            check("password")
                .isLength({min: 8})
                .withMessage("رمز عبور باید بیشتر از 8 کاراکتر باشد"),
            check("token")
                .not().isEmpty()
                .withMessage("توکن نمی تواند خالی باشد"),
        ]

    }
}

module.exports = new ResetPasswordValidator();