const express = require("express");
const router = express.Router();

//Controller
const loginController = require("app/http/controller/auth/loginController");
const registerController = require("app/http/controller/auth/registerController");

//validators
const regisetrValidator = require("app/http/validators/RegisterValidator");
const loginValidator = require("app/http/validators/LoginValidators");

router.get("/login", loginController.showLoginForm);
router.post("/login", loginValidator.handle(), loginController.loginProcess);
router.get("/register", registerController.showRegistrationForm);
router.post("/register", regisetrValidator.handle(), registerController.registrationProcess);

module.exports = router;