class LoginController {
    showLoginForm(req, res) {
        res.render("auth/login.ejs");
    }
}

module.exports = new LoginController();