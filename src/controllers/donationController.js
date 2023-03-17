const ObjectId = require("mongoose").Types.ObjectId;
const multer = require("multer");
const streamifier = require('streamifier');
const donationsModel = require('../models/donationModel');

// * Config
const cloudinary = require('../config/cloudinary');


//get all donation 


const readDonation = async



// Create an  new donation
const createDonation = async (req, res) => {
    const { name, description, price } = req.body;
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
    };

    const imageUrl = await uploadImage(image.buffer);
    const newdonation = await donationsModel.create({
        name,
        description,
        price,
        image: imageUrl
    });

    res.status(200).json(newdonation);
};

module.exports = { createDonation };




// get donation info  by id

module.exports.getDonationInfo = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("ID unknown:" + req.params.id);

    donationsModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log("ID unknown:" + err);
    })
};

// update donation by id

module.exports.updateDonation = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ message: "invalid id" });
    }

    try {
        const updateDonation = await donationsModel.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    images: req.file.path,
                    description: req.body.description,
                    title: req.body.title,
                    price: req.body.price,
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({ message: "donation updated", updateDonation });
    } catch (error) {
        res.status(400).json({ message: "failed to update donation ", error });
    }
};

// delete donation by id

module.exports.deleteDonation = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ message: "invalid id" });
    }

    try {
        const deleteDonation = await donationsModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "donation deleted", deleteDonation });
    } catch (error) {
        res.status(400).json({ message: "failed to delete donation ", error });
    }
};













