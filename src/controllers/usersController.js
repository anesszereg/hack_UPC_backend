// * Third party imports
const asyncHandler = require('express-async-handler');
const { genSaltSync, hashSync } = require('bcrypt');
const { isEmail } = require('validator');

// * Models
const userModel = require('../models/userModel');

// * REGISTER * //
// @desc    Creates a new user account
// @route   POST /api/users
// @access  public
const signUp = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Checks if the user provided email and password
    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter your email and password.');
    };

    // Checks if the user provided a valid email address
    if (!isEmail(email)) {
        res.status(400);
        throw new Error('Please enter a valid email.');
    };

    // Checks if the user already exists
    const userExists = await userModel.findOne({ email: email.toLowerCase() });

    if (userExists) {
        res.status(409);
        throw new Error('Account already exists.');
    };

    // Hashes the password
    const hashedPassword = hashSync(password, genSaltSync(10));

    // Pushes user to the DB
    const user = {
        email: email.toLowerCase(),
        password: hashedPassword
    };

    await userModel.create(user);

    return res.status(200).json({
        message: 'Registered an account.'
    });
});

module.exports = { signUp };