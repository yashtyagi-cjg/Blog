const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Posts = new Schema({
    heading: {type: String},
    content: {type: String},
    authorId: {type: Schema.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
},
{
    toJson: {virtuals: true},
    toObject:{virtuals: true}
})


Posts.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'postId'
})

exports.module = mongoose.model('Post', Posts)