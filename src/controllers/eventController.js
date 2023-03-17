const EventsModel = require("../models/eventModel");
const UserModel = require("../models/userModel");
// const { Event } = require('../routes/user.routes');
const ObjectId = require("mongoose").Types.ObjectId;
const multer = require("multer");

// gat all Events of a user

module.exports.readEvents = async (req, res) => {
  const Events = await EventsModel.find()
    .sort({ createdAt: -1 })
    .populate("author");
  res.status(200).json(Events);
};

// configure the storage for the uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/Events");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// set the upload limits for the images
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
});

// Create an  new Event

module.exports.createEvents = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // handle multer errors
        return res.status(400).json({ message:'image error', err });
      } else if (err) {
        // handle other errors
        return res.status(500).json({ message: err.message });
      }

      const newEvent = new EventsModel({
        // author: req.user._id,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        image: req.file.path,
      });

      const Event = await newEvent.save();
      res.status(200).json({ message: "Event created", Event });
    });
  } catch (error) {
    res.status(400).json({ message: "failed to created new Event ", error });
  }
};

//get all Event of one user

module.exports.EventUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ message: "invalid id" });
  }
  try {
    const userEvents = await EventsModel.find({
      author: req.params.author,
    }).populate("author");
    res.status(200).json({ message: "all Events of this user", userEvents });
  } catch (err) {
    res.status(400).json({ message: "failed to get Events of this user" });
  }
};

//add to user Events

module.exports.userEvents = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ message: "invalid id" });
  }

  try {
    const userLikes = await UserModel.findByIdAndUpdate({
      _id: req.parmas.id,
    }).populate("Events");

    res.status(200).json({ message: "add id Event successfully", userLikes });
  } catch (error) {
    res
      .status(400)
      .json({ message: "failed to add id Event to  user ", error });
  }
};

// get Event info  by id

module.exports.getEventInfo = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown:" + req.params.id);

  EventsModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown:" + err);
  }).populate("author");
};

// update Event by id

module.exports.updateEvent = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ message: "invalid id" });
  }

  try {
    const updateEvent = await EventsModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          images: req.file.path,
          description: req.body.description,
          title: req.body.title,
          membersNumber: req.body.membersNumber,
          location:req.body.location,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ message: "Event updated", updateEvent });
  } catch (error) {
    res.status(400).json({ message: "failed to update Event ", error });
  }
};

// delete Event by id

module.exports.deleteEvent = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ message: "invalid id" });
  }

  try {
    const deleteEvent = await EventsModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted", deleteEvent });
  } catch (error) {
    res.status(400).json({ message: "failed to delete Event ", error });
  }
};














