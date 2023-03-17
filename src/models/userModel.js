const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    fullName: {
        type: String,
        required: true,
        index: true
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true
    }
}, { timestamps: true }
);


module.exports = new mongoose.model('User', userSchema);
