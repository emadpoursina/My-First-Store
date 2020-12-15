const express = require("express");
const router = express.Router();
const passport = require("passport");

//Controller
const loginController = require("app/http/controller/auth/loginController");
const registerController = require("app/http/controller/auth/registerController");
const forgotPasswordController = require("app/http/controller/auth/forgotPasswordController");
const resetPasswordController = require("app/http/controller/auth/resetPasswordController");

//validators
const regisetrValidator = require("app/http/validators/RegisterValidator");
const loginValidator = require("app/http/validators/LoginValidators");
const forgotPasswordValidator = require("app/http/validators/ForgotPasswordValidator");
const resetPasswordValidator = require("app/http/validators/ResetPasswordValidator");

router.get("/login", loginController.showLoginForm);
router.post("/login", loginValidator.handle(), loginController.loginProcess);
router.get("/register", registerController.showRegistrationForm);
router.post("/register", regisetrValidator.handle(), registerController.registrationProcess);

router.get("/password/reset", forgotPasswordController.showForgotPassword);
router.get("/password/reset/:token", resetPasswordController.showResetPassword);
router.post("/password/reset", resetPasswordValidator.handle(), resetPasswordController.resetPasswordProccess);
router.post("/password/email", forgotPasswordValidator.handle(), forgotPasswordController.sendPasswordResetLink);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"]}));
router.get("/google/callback", passport.authenticate("google", { successRedirect: "/", failurRedirect: "/register"}));

module.exports = router;