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

// Set admin page layout
router.use((req, res, next) => {
  res.locals.layout = "admin/master";

  next();
})

// Main admin page router
router.get("/", adminController.index);

// Course Routers
router.get("/courses", courseController.index);
router.get("/courses/create", courseController.creat);
router.post("/courses/create",
  uploadImage.single("images"), // Generate req.file
  convertFileToField.handle, // Set req.body.images
  courseValidator.handle(),
  courseController.store
);
router.get("/courses/:id/edit", courseController.edit);
router.put("/courses/:id",
  uploadImage.single("images"),
  convertFileToField.handle,
  courseValidator.handle(),
  courseController.update,
);
router.delete("/courses/:id", courseController.destroy);

module.exports = router;