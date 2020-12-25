const express = require("express");
const router = express.Router();

const adminController = require("app/http/controller/admin/adminController");

router.use((req, res, next) => {
    res.locals.layout = "admin/master";

    next();
})

router.get("/", adminController.index);

module.exports = router;