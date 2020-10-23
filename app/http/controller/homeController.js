const Controller = require("app/http/controller/controller");

class HomeController extends Controller{
    index(req, res) {
        res.render("home");
    }
}


module.exports = new HomeController();