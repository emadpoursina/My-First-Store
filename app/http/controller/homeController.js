class HomeController {
    index(req, res) {
        res.json("homePage 2");
    }
}


module.exports = new HomeController();