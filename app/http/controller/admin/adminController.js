const Controller = require("app/http/controller/controller");

class AdminController extends Controller{
    index(req, res) {
        res.render("admin/index");
    }

    uploadImage(req, res) {
        res.json({
            "uploaded": 1,
            "fileName": req.file.originalname, 
            "url": `${req.file.destination}/${req.file.filename}`.substring(8),
        });
    }
}


module.exports = new AdminController();