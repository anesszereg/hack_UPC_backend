// * Third party imports
const asyncHandler = require('express-async-handler');
const streamifier = require('streamifier');

// * Config
const cloudinary = require('../config/cloudinary');

// * Models
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

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
                if (error) { reject(new Error('Something went wrong. Please try again later.')); }
                else { resolve(result.secure_url); }
            });
            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    });
    const images = await Promise.all(uploadPromises);

    const newPost = await Post.create({
        author: req.user._id,
        title,
        description,
        images
    });

    return res.status(200).json(newPost);
});

// * COMMENT * //
// @desc    Creates a new comment under a post
// @route   POST /posts/:id/comments
// @access  private
const createComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;


    if (!content) {
        res.status(404);
        throw new Error('Please provide a valid comment.');
    };

    const post = await Post.findById(id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found. Please try again later.');
    };

    const comment = await Comment.create({
        author: req.user._id,
        content,
        post: post._id
    });

    post.comments.push(comment._id);
    post.save();

    res.json(comment);
});

// * LIKE A POST * //
// @desc    Like a post
// @route   POST /posts/:id/likes
// @access  private
const addLike = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found. Please try again later.');
    };

    post.likes.push(req.user._id);
    post.save();

    res.json(post);
});

// * UNLIKE A POST * //
// @desc    Removes a like from a post
// @route   DELETE /posts/:id/likes
// @access  private
const removeLike = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found. Please try again later.');
    };

    post.likes.pull(req.user._id);
    post.save();

    res.json(post);
});

module.exports = { createPost, createComment, addLike, removeLike };