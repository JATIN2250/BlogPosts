const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const blogController = require('../controllers/blog.controller.js'); // Controller ko import karein

// Multer (Image Upload) setup
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

// ### Public Routes ###
// Har route ab apne controller function ko point karega
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// ### Protected Routes ###
router.post('/', auth, upload.single('image'), blogController.createBlog);
router.put('/:id', auth, upload.single('image'), blogController.updateBlog);
router.delete('/:id', auth, blogController.deleteBlog);

module.exports = router;