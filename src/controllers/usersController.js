// * Third party imports
const asyncHandler = require('express-async-handler');
const { genSaltSync, hashSync } = require('bcrypt');
const { isEmail } = require('validator');

// * Models
const User = require('../models/userModel');

// * REGISTER * //
// @desc    Creates a new user account
// @route   POST /api/users
// @access  public
const signUp = asyncHandler(async (req, res) => {
    const { email, password, fullName } = req.body;

    // Checks if the user provided email and password
    if (!email || !password || !fullName) {
        res.status(400);
        throw new Error('Please enter all of your details.');
    };

    // Checks if the user provided a valid email address
    if (!isEmail(email)) {
        res.status(400);
        throw new Error('Please enter a valid email.');
    };

    // Checks if the user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
        res.status(409);
        throw new Error('Account already exists.');
    };

    // Hashes the password
    const hashedPassword = hashSync(password, genSaltSync(10));

    // Pushes user to the DB
    const user = {
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName
    };

    await User.create(user);

    return res.status(200).json({
        message: 'Registered an account.'
    });
});

// * SEARCH * //
// @desc    Finds indexed users by their full name
// @route   GET /api/users
// @access  private
const search = asyncHandler(async (req, res) => {
    const { fullName } = req.query;

    if (!fullName) {
        res.status(409);
        throw new Error('Please provide a query.');
    };

    const results = await User.find({
        fullName: { $regex: fullName, $options: 'i' },
    });

    res.json(results);
});

// * FOLLOW * //
// @desc    Follows a user
// @route   POST /api/users/:id/followers
// @access  public
const follow = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const userToFollow = await User.findById(id);

    if (!userToFollow) {
        res.status(404);
        throw new Error('User not found. Please try again later.');
    };

    const user = await User.findById(req.user._id);

    userToFollow.followers.push(user._id);
    userToFollow.save();

    user.following.push(userToFollow._id);
    user.save();

    res.status(200).json(`You're now following ${user.userToFollow}`)
});


// * UN-FOLLOW * //
// @desc    unFollows a user
// @route   DELETE /api/users/:id/followers
// @access  private
const unFollow = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const userToUnFollow = await User.findById(id);

    if (!userToUnFollow) {
        res.status(404);
        throw new Error('User not found. Please try again later.');
    };

    const user = await User.findById(req.user._id);

    userToUnFollow.followers.pull(user._id);
    userToUnFollow.save();

    user.following.pull(userToUnFollow._id);
    user.save();

    res.status(200).json(`You're now not  following ${user.userToUnFollow}`)
});

module.exports = { signUp, search, follow, unFollow };