const user = require('./../schemas/userSchema');

class userService {
    async createNewUser(req, res) {
        try {
            const { name, username, email, password } = req.body;
            const newUser = new user({
                name,
                username,
                email,
                password,
            });
            const savedUser = await newUser.save();
            res.status(201).json({
                message: 'کاربر با موفقیت ایجاد شد',
                user: {
                    id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                },
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    message: 'این ایمیل یا نام کاربری قبلاً ثبت شده است',
                });
            }
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(
                    (val) => val.message
                );
                return res.status(400).json({
                    status: false,
                    data: {
                        message: messages,
                    },
                });
            }
            res.status(500).json({
                message: 'خطای سرور',
                error: error.message,
            });
        }
    }

    async findUserByUsername(req, res) {
        const { username } = req.params;
        try {
            const foundUser = await user
                .findOne({ username })
                .select('-password')
                .select('-__v');

            if (!foundUser) {
                res.status(404).json({
                    status: false,
                    data: {
                        message: `کاربری با این ${username}نام پیدا نشد.`,
                    },
                });
            }
            res.status(200).json({
                status: true,
                data: {
                    user: {
                        foundUser,
                    },
                },
            });
        } catch (error) {
            console.error('خطا در جستجو:', error.message);
        }
    }
    async findByUserId(req, res) {
        const { id } = req.params;
        try {
            const foundUser = await user
                .findById(id)
                .select('-password')
                .select('-__v');

            if (!foundUser) {
                res.status(404).json({
                    status: false,
                    data: {
                        message: `کاربری با این ${id}نام پیدا نشد.`,
                    },
                });
            }
            res.status(200).json({
                status: true,
                data: {
                    user: {
                        foundUser,
                    },
                },
            });
        } catch (error) {
            console.error('خطا در جستجو:', error.message);
        }
    }
    async updateUserDetail(req, res) {
        const { id } = req.params;
        const updates = req.body;

        try {
            //جلوگیری از تغییر اطلاعت حساس
            const forbiddenFields = ['password', 'role'];
            forbiddenFields.forEach((field) => delete updates[field]);

            const updatedUser = await user
                .findByIdAndUpdate(id, updates, {
                    new: true, // بازگرداندن سند آپدیت شده
                    runValidators: true, // اجرای ولیدیشن‌های اسکیما هنگام آپدیت
                })
                .select('-password -__v');
            if (!updatedUser) {
                return res.status(404).json({
                    status: false,
                    message: 'کاربری با این شناسه یافت نشد.',
                });
            }

            // ۴. پاسخ موفقیت‌آمیز
            res.status(200).json({
                status: true,
                message: 'اطلاعات کاربر با موفقیت به‌روزرسانی شد',
                data: {
                    user: updatedUser,
                },
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    status: false,
                    message:
                        'نام، نام کاربری یا ایمیل وارد شده قبلاً توسط شخص دیگری ثبت شده است.',
                });
            }

            // مدیریت خطاهای ولیدیشن (مثلاً نام کوتاه‌تر از حد مجاز)
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(
                    (val) => val.message
                );
                return res.status(400).json({
                    status: false,
                    message: messages,
                });
            }

            res.status(500).json({
                status: false,
                message: 'خطای سرور در هنگام به‌روزرسانی',
                error: error.message,
            });
        }
    }
}

module.exports = new userService();
