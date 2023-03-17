// * Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/connectDB.js');

const app = express();
const PORT = process.env.PORT || 5000;

// * Middleware * //
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(errorHandler);

// * Routes * //
app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/users', require('./routes/usersRouter'));
app.use('/api/posts', require('./routes/postsRouter'));
app.use('/api/events', require('./routes/eventsRouter'));

// * Connection * //
app.listen(PORT, () => {
    console.log('---------------------');
    console.log(
        'Dev server running at  >'.green,
        `http://localhost:${PORT}`.blue
    );
    connectDB();
});
