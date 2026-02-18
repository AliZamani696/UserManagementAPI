const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'نام  اجباری است'],
            unique: true,
            trim: true,
        },
        username: {
            type: String,
            required: [true, 'نام کاربری اجباری است'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            message: '{VALUE} is not supported',
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
