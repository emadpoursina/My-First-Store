const Controller = require("app/http/controller/controller");

class AdminController extends Controller{
    index(req, res) {
        res.json("admin dashboard 2");
    }
}


module.exports = new AdminController();