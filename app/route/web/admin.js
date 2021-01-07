const express = require("express");
const router = express.Router();

// Controllers
const adminController = require("app/http/controller/admin/adminController");
const courseController = require("app/http/controller/admin/courseController");

// Validators
const courseValidator = require("app/http/validators/CourseValidator");

//Middlewares
const uploadImage = require("app/helpers/uploadImage.js") //helpers
const convertFileToField = require("app/http/middleware/ConvertFileToField.js");

router.use((req, res, next) => {
  res.locals.layout = "admin/master";

  next();
})

router.get("/", adminController.index);
router.get("/courses", courseController.index);
router.get("/courses/create", courseController.creat);
router.post("/courses/create",
  uploadImage.single("images"),
  convertFileToField.handle,
  courseValidator.handle(),
  courseController.store
);
router.delete("/courses/:id", courseController.destroy);

module.exports = router;