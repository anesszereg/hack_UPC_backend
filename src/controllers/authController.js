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
        const message = 'Please enter a valid email.'
        res.status(400).json({ message });
        throw new Error(message);
    };

    // Checks if the user provided a valid email address
    if (!isEmail(email)) {
        const message = 'Please enter a valid email.'
        res.status(400).json({ message });
        throw new Error(message);
    };

    // Finds the user
    const user = await User.findOne({ email: email.toLowerCase() })
        .select('+password');

    if (user && compareSync(password, user.password)) {
        return res.status(200).json({
            data: {
                token: generateJWT(user._id),
                details: user
            }
        });
    };

    const message = 'Wrong Email or Password.';
    res.status(401).json({ message });
    throw new Error(message);
}));

module.exports = { logIn };
