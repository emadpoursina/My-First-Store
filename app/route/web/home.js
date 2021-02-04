const express = require("express");
const router = express.Router();

//Controllers
const homeController = require("app/http/controller/homeController");
const courseController = require('app/http/controller/CourseController');

router.get("/logout", (req, res) => {
    req.logOut();
    res.clearCookie("remember_token");
    res.redirect("/");
})

router.get("/", homeController.index);
router.get("/about-me", homeController.about);
router.get("/courses", courseController.index);
router.get("/courses/:course", courseController.single);

module.exports = router;