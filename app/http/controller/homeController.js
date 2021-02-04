const Controller = require("app/http/controller/controller");
const Course = require('app/model/Course');

class HomeController extends Controller{
    async index(req, res) {
        const courses = await Course.find({}).sort({ createdAt: 1 }).limit(8).exec();
        res.render("home/", {title: "Home", courses});
    }

    about(req, res) {
        res.render("home/about", {title: 'aboutme'});
    }
}

module.exports = new HomeController();