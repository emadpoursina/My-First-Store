const Controller = require("app/http/controller/controller");
const passport = require("passport");

class RegisterController extends Controller {
	showRegistrationForm(req, res) {
		res.render("home/auth/register.ejs", { recaptcha: this.recaptcha.render(), title: "Register" });
	}

	async registrationProcess(req, res, next) {
		try {
			await this.recaptchaValidation(req, res);
			const result = await this.validateData(req);
				if(result) this.registerUser(req, res, next);
				else{
					req.flash("formdata", req.body);
					res.redirect("/auth/register");
				} 
		} catch (error) {
			console.log(error); 
		}
	}

	registerUser(req, res, next) {
		passport.authenticate("local.register", {
			successRedirect: "/",
			failureRedirect: "/auth/register",
			failureFlash: true
		})(req, res, next);
	}
}

module.exports = new RegisterController();