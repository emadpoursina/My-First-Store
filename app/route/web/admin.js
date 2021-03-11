const express = require("express");
const router = express.Router();

// Controllers
const adminController = require("app/http/controller/admin/adminController");
const courseController = require("app/http/controller/admin/courseController");
const episodeController = require("app/http/controller/admin/EpisodeController");
const commentController = require('app/http/controller/admin/CommentController')
const categoryController = require('app/http/controller/admin/CategoryController');
const userController = require('app/http/controller/admin/UserController');

// Validators
const courseValidator = require("app/http/validators/CourseValidator");
const episodeValidator = require("app/http/validators/EpisodeValidator");
const categoryValidator = require('app/http/validators/CategoryValidator');

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

// User routes
router.get('/users', userController.index);
router.get('/users/:id/toggleadmin', userController.toggleAdmin);
router.delete('/users/:id/', userController.destroy);

// Episode Routers
router.get("/episodes", episodeController.index);
router.get("/episodes/create", episodeController.create);
router.post("/episodes/create", episodeValidator.handle(), episodeController.store);
router.delete("/episodes/:id", episodeController.destroy);
router.get("/episodes/:id/edit", episodeController.edit);
router.put("/episodes/:id", episodeValidator.handle(), episodeController.update);

// Category Routers
router.get('/categories', categoryController.index);
router.get('/categories/create', categoryController.create);
router.post('/categories/create', categoryValidator.handle(), categoryController.store);
router.get('/categories/:id/edit', categoryController.edit);
router.put('/categories/:id/', categoryValidator.handle(), categoryController.update);
router.delete('/categories/:id', categoryController.destroy);

// Comments Routers
router.get('/comments', commentController.index);
router.get('/comments/approved', commentController.approved);
router.put('/comments/:id/approve', commentController.approve);
router.delete('/comments/:id', commentController.destroy);

// Upload image for ckeditor
router.post("/upload-image", uploadImage.single("upload"), adminController.uploadImage);
  

module.exports = router;