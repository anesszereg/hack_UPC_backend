// * Third party imports
const asyncHandler = require('express-async-handler');
const streamifier = require('streamifier');

// * Models
const eventModel = require("../models/eventModel");

// * Config
const cloudinary = require('../config/cloudinary');

// Create an  new Event
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


module.exports = { createEvent };