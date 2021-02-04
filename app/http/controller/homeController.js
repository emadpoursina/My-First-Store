const Controller = require("app/http/controller/controller");

class HomeController extends Controller{
    index(req, res) {
        res.render("home/", {title: "Home"});
    }

    about(req, res) {
        res.render("home/about", {title: 'aboutme'});
    }
}


module.exports = new HomeController();