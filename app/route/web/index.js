const express = require("express");
const router = express.Router();

/* Handle all of the route for the admin area */
const adminRouter = require("./admin");
router.use("/admin", adminRouter);

/* Handle all of the public area */
const homeRouter = require("./home");
router.use("/", homeRouter);

module.exports = router;