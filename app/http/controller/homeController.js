const Controller = require("./controller");

class HomeController extends Controller{
    index(req, res) {
        res.json("homePage 2");
    }
}


module.exports = new HomeController();