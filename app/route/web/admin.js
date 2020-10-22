const express = require("express");
const router = express.Router();

const adminController = require("./../../http/controller/admin/adminController");

router.get("/", adminController.index);

module.exports = router;