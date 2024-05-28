const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique },
        password: { type: String, required: true },
        location: { type: String, default: 'Ho Chi Minh city' },
    },
    { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)
