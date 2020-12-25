const Controller = require("./../controller");

class CourseController extends Controller {
    index(req, res) {
       res.render("admin/courses/index", {title: "دوره ها"});
    }

    creat(req, res) {
        res.render("admin/courses/creat");
    }
}

module.exports = new CourseController();