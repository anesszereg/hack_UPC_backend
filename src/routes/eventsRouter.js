// * Third party imports
const express = require('express');
const router = express.Router();
const multer = require('multer');

// * Controller imports
const { createEvent, getEventById } = require('../controllers/eventsController');

// * Middleware
const authenticate = require('../middleware/authenticate');

// * Configure Multer
const upload = multer();

router.post('/', authenticate, upload.single('image'), createEvent);
router.get('/:id', authenticate, getEventById);

module.exports = router;
