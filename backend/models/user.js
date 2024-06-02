const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = Schema.new({
    name: {type: String},
    username: {type: String},
    hash: {type: String},
    salt: {type: String},
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', User)