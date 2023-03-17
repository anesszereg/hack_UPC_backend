const express = require('express');
const router = express.Router();

const { signUp, search, follow, unFollow } = require('../controllers/usersController');

// * Middleware
const authenticate = require('../middleware/authenticate');

router.post('/', signUp);

router.post('/:id/followers', authenticate, follow);
router.delete('/:id/followers', authenticate, unFollow);

router.get('/', search);

module.exports = router;
