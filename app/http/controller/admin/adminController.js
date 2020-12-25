const Controller = require("app/http/controller/controller");

class AdminController extends Controller{
    index(req, res) {
        res.render("admin/index");
    }
}


module.exports = new AdminController();