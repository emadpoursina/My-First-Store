const express = require("express");
const router = express.Router();

//Controllers
const homeController = require("app/http/controller/homeController");
const loginController = require("app/http/controller/auth/loginController");
const registerController = require("app/http/controller/auth/registerController");

//Middlewares
const redirectIfAuthenticated = require("app/http/middleware/RedirectIfAuthenticated");

//validators
const regisetrValidator = require("app/http/validators/RegisterValidator");
const loginValidator = require("app/http/validators/LoginValidators");

router.get("/", homeController.index);
router.get("/login", redirectIfAuthenticated.handle, loginController.showLoginForm);
router.post("/login", redirectIfAuthenticated.handle, loginValidator.handle(), loginController.loginProcess);
router.get("/register", redirectIfAuthenticated.handle, registerController.showRegistrationForm);
router.post("/register", redirectIfAuthenticated.handle, regisetrValidator.handle(), registerController.registrationProcess);

router.get("/logout", (req, res) => {
    req.logOut();
    res.clearCookie("remember_token");
    res.redirect("/");
})


module.exports = router;