const express = require("express");
const router = express.Router();

//Controllers
const homeController = require("app/http/controller/homeController");
const courseController = require('app/http/controller/CourseController');
const userController = require('app/http/controller/UserController');

//Vlidators
const commentValidator = require('app/http/validators/CommentValidator');

//Middlewares
const redirectIfNotAuthenticate = require('app/http/middleware/RedirectIfNotAuthenticated.js');

router.get("/logout", (req, res) => {
    req.logOut();
    res.clearCookie("remember_token");
    res.redirect("/");
})

// Courses routes
router.get("/courses", courseController.index);
router.get("/courses/:course", courseController.single);
router.post("/courses/payment", redirectIfNotAuthenticate.handle, courseController.payment)
router.get("/courses/payment/checker", redirectIfNotAuthenticate.handle, courseController.checker);

router.get("/", homeController.index);
router.get("/about-me", homeController.about);
router.get("/download/:id", courseController.download);
router.post("/comment", redirectIfNotAuthenticate.handle, commentValidator.handle(),  homeController.comment);
router.get("/test", homeController.test);
router.get("/user/panel", redirectIfNotAuthenticate.handle, userController.index);
router.get("/user/panel/history", redirectIfNotAuthenticate.handle, userController.history);

// Vip routes
router.get("/user/panel/vip", userController.vip);
router.post("/vip/payment", redirectIfNotAuthenticate.handle, userController.payment);
router.get("/vip/payment/checker", redirectIfNotAuthenticate.handle, userController.paymentCheck);

module.exports = router;