// * Third party imports
const express = require('express');
const router = express.Router();
const multer = require('multer');

// * Middleware
const authenticate = require('../middleware/authenticate');

// * Controller imports
const { createPost } = require('../controllers/postsController');

// * Configure Multer
const upload = multer();

router.post('/', authenticate, upload.array('images', 10), createPost);

module.exports = router;
