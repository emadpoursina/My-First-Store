const middleware = require("./middleware");

class ErrorHandler extends middleware {
  handle(err) {
    const statusCode = err.statusCode;
    const stack = err.stack;
    const message = err.message;
    res.render("errors/stack", {title: statusCode, stack, message});
  }
} 

module.exports = new ErrorHandler();