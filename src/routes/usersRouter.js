const express = require('express');
const router = express.Router();

const { signUp } = require('../controllers/usersController');

router.post('/', signUp);

module.exports = router;
