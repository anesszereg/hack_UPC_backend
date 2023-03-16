// * Third party imports
const asyncHandler = require('express-async-handler');
const { genSaltSync, hashSync } = require('bcrypt');
const { isEmail } = require('validator');

// * Models
const userModel = require('../models/userModel');

// * CREATE POST * //
// @desc    Creates a new post
// @route   POST /api/posts
// @access  private
const createPost = asyncHandler(async (req, res) => {
    // const {title, description}
});

module.exports = { createPost };