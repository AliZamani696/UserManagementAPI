const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

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
            unique: true,
            validate: [validator.isEmail, 'فرمت ایمیل وارد شده صحیح نیست'],
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
        // when add this field by default create at is now!
        timestamps: true,
    }
);
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
