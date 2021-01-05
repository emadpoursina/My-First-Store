const Middlewares = require("./middleware");

class ConvertFileToField extends Middlewares {
  handle(req, res, next) {
    if(!req.file)
      req.body.images = undefined;
    else
      req.body.images = req.file.originalname;
    
    next();
  }
}

module.exports = new ConvertFileToField();