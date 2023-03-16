const express = require('express');
const router = express.Router();

const { logIn } = require('../controllers/authController');

router.post('/', logIn);

module.exports = router;
