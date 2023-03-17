const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    membersNumber: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true,
    },
    sponsors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sponsors'
    }]
}, { timestamps: true });

module.exports = new mongoose.model('Event', eventSchema);
