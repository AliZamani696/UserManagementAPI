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
    async deleteUserById(req, res) {
        const { id } = req.params;
        try {
            const deletedUser = await user.findByIdAndDelete(id);

            if (!deletedUser) {
                return res.status(404).json({
                    status: false,
                    message: 'کاربری برای حذف پیدا نشد.',
                });
            }

            res.status(200).json({
                status: true,
                message: 'کاربر با موفقیت حذف شد.',
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'خطا در عملیات حذف',
                error: error.message,
            });
        }
    }
    async findAllUsers(req, res) {
        try {
            // ۱. دریافت پارامترها از Query String
            // پیش‌فرض صفحه ۱ و تعداد هر صفحه ۱۰ کاربر
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // ۲. فیلترینگ (Filtering)
            // کپی از کوئری برای فیلتر کردن پارامترهای خاص مثل page و limit
            const queryObj = { ...req.query };
            const excludedFields = ['page', 'sort', 'limit', 'fields'];
            excludedFields.forEach((el) => delete queryObj[el]);

            // قابلیت فیلتر پیشرفته (مثلاً جستجوی نام با حروف مشابه)
            if (queryObj.name) {
                queryObj.name = { $regex: queryObj.name, $options: 'i' }; // 'i' یعنی حساس نبودن به حروف بزرگ و کوچک
            }

            // ۳. اجرای کوئری با Pagination
            const users = await user
                .find(queryObj)
                .select('-password -__v') // عدم نمایش پسورد
                .skip(skip)
                .limit(limit)
                .sort('-createdAt'); // مرتب‌سازی بر اساس جدیدترین‌ها

            // ۴. گرفتن تعداد کل برای محاسبات فرانت‌انده
            const totalUsers = await user.countDocuments(queryObj);
            const totalPages = Math.ceil(totalUsers / limit);

            res.status(200).json({
                status: true,
                results: users.length,
                pagination: {
                    totalUsers,
                    totalPages,
                    currentPage: page,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
                data: { users },
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'خطا در دریافت لیست کاربران',
                error: error.message,
            });
        }
    }
}

module.exports = new userService();
