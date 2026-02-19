const user = require('./../schemas/userSchema');
const generateToken = require('./../utils/generateToken');

class authService {
    async registerUser(req, res) {
        try {
            const { name, username, email, password, role } = req.body;

            const existingUser = await user.findOne({
                email: email.toLowerCase(),
            });
            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    message: 'این ایمیل قبلاً ثبت شده است. لطفا وارد شوید.',
                });
            }

            const newUser = await user.create({
                name,
                username,
                email,
                password,
                role,
            });
            const token = generateToken(newUser);
            res.status(201).json({
                status: true,
                token,
                message: 'ثبت‌نام با موفقیت انجام شد',
            });
        } catch (error) {
            res.status(400).json({ status: false, message: error.message });
        }
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: 'ایمیل و رمز عبور الزامی هستند' });
            }

            const User = await user.findOne({ email: email.toLowerCase() });

            if (!User || !(await User.comparePassword(password))) {
                return res.status(401).json({
                    status: false,
                    message: 'ایمیل یا رمز عبور اشتباه است',
                });
            }
            const token = generateToken(User);
            res.status(200).json({
                status: true,
                token,
                message: `خوش آمدید ${User.name}`,
            });
        } catch (error) {
            res.status(500).json({ status: false, message: 'خطای سرور' });
        }
    }
}

module.exports = new authService();
