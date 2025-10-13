const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/user.controller.js'); // Controller ko import karein

// Route ko controller function se jodein
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/auth', auth, userController.getAuthenticatedUser);

module.exports = router;