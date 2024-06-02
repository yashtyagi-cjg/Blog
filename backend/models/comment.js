const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Comment = new Schema ({
    comment: {
        type: String
    },
    authorId: {
        type: Schema.Types.ObjectId, 
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
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

exports.module = Schema.model('Comment', Comment)