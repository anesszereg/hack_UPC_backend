const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true }
);

module.exports = new mongoose.model('User', userSchema);
