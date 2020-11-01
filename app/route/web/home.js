const express = require("express");
const router = express.Router();

const homeController = require("app/http/controller/homeController");
const loginController = require("app/http/controller/auth/loginController");
const registerController = require("app/http/controller/auth/registerController");

router.get("/", homeController.index);
router.get("/login", loginController.showLoginForm);
router.post("/login", loginController.loginProcess);
router.get("/register", registerController.showRegistrationForm);
router.post("/register", registerController.registrationProcess);


module.exports = router;