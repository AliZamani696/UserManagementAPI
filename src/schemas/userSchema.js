const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

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
            required: true,
            message: '{VALUE} نقش وارد شده مجاز نمیباشد ',
        },
        tokenVersion: {
            type: Number,
            default: 0,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        // when add this field by default create at is now!
        timestamps: true,
    }
);
// چرا نباید یک نمک یکسان داشته باشیم چون اگه لو بره همه پسورد شکسته میشن به خاطر این از نمک های متفاوت استفاده میکنیم خوب اگه نمک متفاوت داشته باشیم که موقع لاگین به مشکل برمیخوریم؟
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 دقیقه

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
