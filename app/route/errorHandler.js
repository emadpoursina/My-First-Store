const express = require("express");
const router = express.Router();


router.all('*', (req, res, next) => {
  try {
    res.statusCode = 404;
    throw Error("چنین صفحه ای وجود ندارد");
  } catch (err) {
    next(err);  
  }
});

router.use((err, req, res, next) => {
  const statusCode = res.statusCode;
  const stack = err.stack;
  const message = err.message;
  res.render("errors/stack", {title: statusCode, stack, message});
});

module.exports = router;