const express = require("express");
const router = express.Router();

// Middlewares
const redirectIfAuthenticated = require("app/http/middleware/RedirectIfAuthenticated");
const redirectIfNotAdmin = require("app/http/middleware/RedirectIfNotAdmin");

// Admin Router
const adminRouter = require("app/route/web/admin");
router.use("/admin", redirectIfNotAdmin.handle, adminRouter);

// Home Router
const homeRouter = require("app/route/web/home");
router.use("/", homeRouter);

// Auth Router
const authRouter = require("app/route/web/auth");
router.use("/auth", redirectIfAuthenticated.handle, authRouter);

module.exports = router;
