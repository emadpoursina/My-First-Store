const express = require("express");
const router = express.Router();

// Controllers
const adminController = require("app/http/controller/admin/adminController");
const courseController = require("app/http/controller/admin/courseController");

// Validators
const courseValidator = require("app/http/validators/CourseValidator");


//Middlewares

router.use((req, res, next) => {
    res.locals.layout = "admin/master";

    next();
})

router.get("/", adminController.index);
router.get("/courses", courseController.index);
router.get("/courses/create", courseController.creat);
router.post("/courses/create", courseValidator.handle(), courseController.store);

module.exports = router;