// * Third party imports
const express = require('express');
const router = express.Router();
const multer = require('multer');

// * Controller imports
const { createEvent } = require('../controllers/eventsController');

// * Middleware
const authenticate = require('../middleware/authenticate');

// * Configure Multer
const upload = multer();

router.post('/', authenticate, upload.single('image'), createEvent);

module.exports = router;
