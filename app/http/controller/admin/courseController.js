const Controller = require("./../controller");
const Course = require("app/model/Course");

class CourseController extends Controller {
    index(req, res) {
       res.render("admin/courses/index", {title: "دوره ها"});
    }

    creat(req, res) {
        res.render("admin/courses/creat");
    }

    async store(req, res) {
        const result = await this.validateData(req);
        if(!result) {
            return this.back(req, res);
        }

        const images = req.body.images;
        const { title , body , type , price , tags } = req.body;

        const newCourse = new Course({
            user: req.user._id,
            title,
            body,
            slug: this.slug(title),
            type,
            price,
            tags,
            images,
        }); 

        await newCourse.save();
        return res.redirect("/admin/courses");
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new CourseController();