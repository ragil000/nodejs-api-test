const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)