const middleware = require("./middleware");

class ErrorHandler extends middleware {
  handle404(req, res, next) {
    try {
      throw Error("چنین صفحه ای وجود ندارد");
    } catch (err) {
      err.statusCode = 404;
      next(err);  
    }
  }

  handle(err) {
    const statusCode = err.statusCode;
    const stack = err.stack;
    const message = err.message;
    res.render("errors/stack", {title: statusCode, stack, message});
  }
} 

module.exports = new ErrorHandler();