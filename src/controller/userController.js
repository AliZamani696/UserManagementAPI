const userService = require('../service/userService');
const autoBind = require('auto-bind');

class userController {
    constructor() {
        autoBind(this);
    }
    async createUser(req, res) {
        try {
            const result = await userService.createNewUser(req);
            res.status(201).json({
                message: 'کاربر با موفقیت ایجاد شد',
                user: {
                    id: result._id,
                    username: result.username,
                    email: result.email,
                },
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    message: 'این ایمیل یا نام کاربری قبلاً ثبت شده است',
                });
            }
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((val) => val.message);
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
    async findUserByUserName(req, res) {
        try {
            const result = await userService.findUserByUsername(req);
            return res.status(200).json({
                status: true,
                data: {
                    user: result,
                },
            });
        } catch (error) {
            return res.status(400).json({
                message: 'خطا در جستجو:',
                error: error.message,
            });
        }
    }
    async findByUserID(req, res) {
        try {
            const result = await userService.findByUserId(req);
            res.status(200).json({
                status: true,
                data: {
                    user: {
                        result,
                    },
                },
            });
        } catch (error) {
            return res.status(400).json({
                message: 'خطا در جستجو:',
                error: error.message,
            });
        }
    }
    async updateUser(req, res) {
        try {
            const result = await userService.updateUserDetail(req);
            res.status(200).json({
                status: true,
                message: 'اطلاعات کاربر با موفقیت به‌روزرسانی شد',
                data: {
                    user: result,
                },
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    status: false,
                    message: 'نام، نام کاربری یا ایمیل وارد شده قبلاً توسط شخص دیگری ثبت شده است.',
                });
            }

            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((val) => val.message);
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
    async deleteUser(req, res) {
        try {
            const result = await userService.deleteUserById(req);
            return res.status(200).json({
                status: true,
                message: 'اطلاعات کاربر با موفقیت حذف شد',
                data: {
                    user: result,
                },
            });
        } catch (error) {
            return res.status(400).json({
                message: 'خطا در حذف کردن کاربر:',
                error: error.message,
            });
        }
    }
    async getAllUsers(req, res) {
        try {
            const result = await userService.findAllUsers(req, res);
            res.status(200).json({
                status: true,
                results: result.length,
                pagination: {
                    totalUsers: result.totalUsers,
                    totalPages: result.totalPages,
                    currentPage: (result.currentPage = result.page),
                    hasNextPage: (result.hasNextPage = result.page < result.totalPages),
                    hasPrevPage: (result.hasPrevPage = result.page > 1),
                },
                data: { result },
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

module.exports = new userController();
