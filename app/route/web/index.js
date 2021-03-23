const express = require("express");
const router = express.Router();

// Middlewares
const redirectIfAuthenticated = require("app/http/middleware/RedirectIfAuthenticated");
const redirectIfNotAdmin = require("app/http/middleware/RedirectIfNotAdmin");

// Check for language
router.use((req, res, next) => {
  try {
    const lang = req.signedCookies.lang;
    if(req.getLocales().includes(lang))
      req.setLocale(lang)
    else
      req.setLocale(req.getLocale());
    next();
  } catch (error) {
    next(error);    
  }
})

// Change site language
router.get('/lang/:lang', (req, res, next) => {
  const lang = req.params.lang;
  if(req.getLocales().includes(lang))
    res.cookie('lang', lang, { maxAge: 100 * 60 * 60 * 24 * 90, signed: true });

  res.redirect(req.header('Referer') || '/');
});

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