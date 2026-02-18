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
                return res.status(400).json({ message: messages });
            }
            res.status(500).json({
                message: 'خطای سرور',
                error: error.message,
            });
        }
    }
}
module.exports = new userService();
