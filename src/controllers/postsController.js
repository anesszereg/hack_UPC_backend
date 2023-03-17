// * Third party imports
const asyncHandler = require('express-async-handler');
const streamifier = require('streamifier');

// * Config
const cloudinary = require('../config/cloudinary');

// * Models
const userModel = require('../models/userModel');
const postModel = require('../models/postModel');

// * CREATE POST * //
// @desc    Creates a new post
// @route   POST /api/posts
// @access  private
const createPost = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const files = req.files;

    // Checks if the user provided both a title and a description 
    if (!title || !description) {
        res.status(400);
        throw new Error('Please enter both the title and  description.');
    };

    const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: 'posts' }, (error, result) => {
                if (error) {
                    reject(new Error('Something went wrong. Please try again later.'));
                } else {
                    resolve(result.secure_url);
                }
            });
            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    });
    const images = await Promise.all(uploadPromises);

    const newPost = await postModel.create({
        author: req.user._id,
        title,
        description,
        images
    });

    return res.status(200).json(newPost);
});

module.exports = { createPost };