class RegisterController {
    showRegistrationForm(req, res) {
        res.render("auth/register.ejs");
    }
}

module.exports = new RegisterController();