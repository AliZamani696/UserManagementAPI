const user = require('./../schemas/userSchema');
const {
    generateToken,
    generateRefreshToken,
} = require('./../utils/generateToken');
const redisClient = require('./../config/redis');
const jwt = require('jsonwebtoken');

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
            const refreshToken = generateRefreshToken(newUser);

            const refreshKey = `refresh:${newUser._id}`;
            await redisClient.set(refreshKey, refreshToken, {
                EX: 7 * 24 * 60 * 60, // 7 روز TTL
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // اگر https داشتی true کن
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
            });

            res.status(201).json({
                status: true,
                data: {
                    user: {
                        id: newUser._id,
                        username: newUser.username,
                        name: newUser.name,
                        role: newUser.role,
                    },
                },
                token,
                message: 'ثبت‌نام با موفقیت انجام شد',
            });
        } catch (error) {
            res.status(400).json({ status: false, error: error.message });
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
            User.tokenVersion = (User.tokenVersion || 0) + 1;
            await User.save();

            const token = generateToken(User);
            const refreshToken = generateRefreshToken(User);

            const refreshKey = `refresh:${User._id}`;
            await redisClient.set(refreshKey, refreshToken, {
                EX: 7 * 24 * 60 * 60, // 7 روز TTL
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // اگر https داشتی true کن
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
            });

            return res.status(201).json({
                status: true,
                data: {
                    user: {
                        id: User.id,
                        username: User.username,
                        name: User.name,
                        role: User.role,
                    },
                },
                token,
                message: 'ورود با موفقیت انجام شد',
            });
        } catch (error) {
            return res
                .status(500)
                .json({ status: false, message: error.message });
        }
    }
    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({
                    status: false,
                    message: 'Refresh token وجود ندارد',
                });
            }

            const decoded = jwt.verify(
                refreshToken,
                '0698dbaf55aa108e77dd8013276c4e0f751d2854b26101b9233277bfcbf937bf'
            );

            const refreshKey = `refresh:${decoded.id}`;
            const savedRefreshToken = await redisClient.get(refreshKey);
            if (!savedRefreshToken || savedRefreshToken !== refreshToken) {
                return res.status(403).json({
                    status: false,
                    message: 'Refresh token نامعتبر است یا logout شده',
                });
            }

            const User = await user.findById(decoded.id);
            if (!User) {
                return res.status(404).json({
                    status: false,
                    message: 'کاربر یافت نشد',
                });
            }
            const newAccessToken = generateToken(User);

            return res.status(200).json({
                status: true,
                message: 'Access token جدید صادر شد',
                newAccessToken,
            });
        } catch (error) {
            console.log('Refresh Error:', error.message);

            return res.status(403).json({
                status: false,
                message: error.message,
            });
        }
    }

    async logout(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(400).json({
                    status: false,
                    message: 'refreshToken وجود ندارد',
                });
            }

            const decoded = jwt.verify(
                refreshToken,
                // process.env.JWT_REFRESH_SECRET
                '0698dbaf55aa108e77dd8013276c4e0f751d2854b26101b9233277bfcbf937bf'
            );

            await redisClient.del(`refresh:${decoded.id}`);

            res.clearCookie('refreshToken');

            return res.status(200).json({
                status: true,
                message: 'Logout موفقیت آمیز بود',
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'خطای سرور',
            });
        }
    }
}

module.exports = new authService();
