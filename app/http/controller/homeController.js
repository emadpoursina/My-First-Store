const Controller = require("app/http/controller/controller");

class HomeController extends Controller{
    index(req, res) {
        res.json("homePage 2");
    }
}


module.exports = new HomeController();