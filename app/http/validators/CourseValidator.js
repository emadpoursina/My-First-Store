const Validator = require("./Validator");
const { check } = require("express-validator/check")
const Course = require("app/model/Course");
const path = require("path");

class CousreValidator extends Validator{
    handle(req, res) {
        return [
            check("title")
                .isLength({ min: 3, max: 50 })
                .withMessage("طول نام دوره نمی توانم کمتر از 3 و بیشتر از 50 کاراکتر باشد.")
                .custom(async (value) => {
                    const course = await Course.findOne({ slug: this.slug(value)})
                    if(course){
                        throw new Error("یک دوره با این نام از قبل موجود است.")
                    }
                }),
            check("type")
                .isLength({ max: 50})
                .withMessage("طول نوع نمی تواند بیشتر از 50 کاراکتر باشد"),
            check("body")
                .isLength({ min: 3, max: 150 })
                .withMessage("طول توضیحات دوره نمی توانم کمتر از 3 و بیشتر از 150 کاراکتر باشد."),
            check("images")
                .custom(async (value) => {
                    if(! value)
                        throw new Error("فیلد عکس الزامی است.")

                    const fileExt = [".jpg", ".jpeg", ".png", ".svg"];
                    if(!fileExt.includes(path.extname(value)))
                        throw new Error("فرمت عکس وارد شده معتبر نیست")
                }),
            check("price")
                .not().isEmpty()
                .withMessage("لطفا قیمت را وارد کنید"),
            check("tags")
                .isLength({ min: 3, max: 50 })
                .withMessage("طول برچسب دوره نمی توانم کمتر از 3 و بیشتر از 150 کاراکتر باشد."),
        ];
    }

    slug(value) {
        return value.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-");
    }
}

module.exports = new CousreValidator();