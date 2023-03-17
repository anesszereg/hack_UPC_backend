const mongoose = require('mongoose');

const sponsorsSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },

}, { timestamps: true });

module.exports = new mongoose.model('Sponsors', sponsorsSchema);
