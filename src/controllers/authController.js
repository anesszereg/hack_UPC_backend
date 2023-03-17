// * Third party imports
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { compareSync } = require('bcrypt');
const { isEmail } = require('validator');

// * Helper functions
const generateJWT = require('../functions/generateJWT');

// * Models
const User = require('../models/userModel');

// * LOG IN * //
// @desc    login user
// @route   POST /api/auth
// @access  public
const logIn = ('/', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Checks if the user provided email and password
    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter an email and password.');
    };

    // Checks if the user provided a valid email address
    if (!isEmail(email)) {
        res.status(400);
        throw new Error('Please enter a valid email.');
    };

    // Finds the user
    const user = await User.findOne({ email: email.toLowerCase() })
        .select('+password');

    if (user && compareSync(password, user.password)) {
        return res.status(200).json({
            token: generateJWT(user._id),
            details: user
        });
    };

    const message = 'Wrong Email or Password.';
    res.status(401).json(message);
    throw new Error(message);
}));

module.exports = { logIn };
