const express = require("express");
const router = express.Router();

const adminController = require("app/http/controller/admin/adminController");
const courseController = require("app/http/controller/admin/courseController");

router.use((req, res, next) => {
    res.locals.layout = "admin/master";

    next();
})

router.get("/", adminController.index);
router.get("/courses", courseController.index);
router.get("/courses/create", courseController.creat);

module.exports = router;