const express = require('express');
const router = express.Router();

const { createEvents } = require('../controllers/eventController');

// create new event 

router.post('/', createEvents);



module.exports = router;
