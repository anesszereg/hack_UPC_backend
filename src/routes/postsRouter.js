// * Third party imports
const express = require('express');
const router = express.Router();
const multer = require('multer');

// * Middleware
const authenticate = require('../middleware/authenticate');

// * Controller imports
const { createPost, createComment, addLike, removeLike } = require('../controllers/postsController');

// * Configure Multer
const upload = multer();

router.post('/', authenticate, upload.array('images', 10), createPost);
router.post('/:id/comments', authenticate, createComment);

router.post('/:id/likes', authenticate, addLike);
router.delete('/:id/likes', authenticate, removeLike);

module.exports = router;
