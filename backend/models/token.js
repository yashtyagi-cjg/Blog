const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Token = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d',
    }
})

module.exports = mongoose.model('Token', Token);