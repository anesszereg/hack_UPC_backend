// * Third party imports
const express = require('express');
const router = express.Router();
const multer = require('multer');

// * Controller imports
const { createDonation } = require('../controllers/donationController');

// * Configure Multer
const upload = multer();

router.post('/', upload.single('image'), createDonation);

router.get('/', getDona)

module.exports = router;
