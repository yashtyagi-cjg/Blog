const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Comment = new Schema ({
    comment: {
        type: String
    },
    authorId: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        requried: true
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment', Comment)