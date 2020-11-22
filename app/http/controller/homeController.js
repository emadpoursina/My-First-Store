const Controller = require("app/http/controller/controller");

class HomeController extends Controller{
    index(req, res) {
        res.render("home/", {title: "Home"});
    }
}


module.exports = new HomeController();