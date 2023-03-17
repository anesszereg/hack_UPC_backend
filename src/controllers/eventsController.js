// * Third party imports
const asyncHandler = require('express-async-handler');
const streamifier = require('streamifier');

// * Models
const eventModel = require("../models/eventModel");

// * Config
const cloudinary = require('../config/cloudinary');

// * CREATE EVENT * //
// @desc    Creates a new event
// @route   POST /api/events
// @access  private
const createEvent = async (req, res) => {
  const { title, description, location } = req.body;
  const image = req.file;

  const uploadImage = (imageBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'events' }, (error, result) => {
        if (error) { reject(error); }
        else { resolve(result.secure_url); };
      });
      // Stream the image to Cloudinary
      streamifier.createReadStream(imageBuffer).pipe(stream);
    });
  }

  const imageUrl = await uploadImage(image.buffer);
  const newEvent = await eventModel.create({
    author: req.user._id,
    title,
    description,
    location,
    image: imageUrl
  });

  res.status(200).json(newEvent);
};

// * GET EVENT * //
// @desc    Gets an event by its id
// @route   GET /api/events/:id
// @access  private
const getEventById = async (req, res) => {
  const { id } = req.params;

  const post = await eventModel.findById(id);

  res.status(200).json(post);
};


module.exports = { createEvent, getEventById };