const express = require("express");
const router = express.Router();

//Controllers
const homeController = require("app/http/controller/homeController");

router.get("/", homeController.index);

router.get("/logout", (req, res) => {
    req.logOut();
    res.clearCookie("remember_token");
    res.redirect("/");
})

module.exports = router;