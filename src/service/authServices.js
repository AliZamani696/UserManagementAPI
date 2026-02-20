const user = require('./../schemas/userSchema');
const { generateToken, generateRefreshToken } = require('./../utils/generateToken');
const redisClient = require('./../config/redis');
const jwt = require('jsonwebtoken');
const appConfig = require('./../config/appConfig');

class authService {
  async registerUser(userData) {
    const { name, username, email, password, role } = userData;

    const existingUser = await user.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error('این ایمیل قبلاً ثبت شده است. لطفا وارد شوید.');
      error.statusCode = 400;
      throw error;
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
      EX: 7 * 24 * 60 * 60,
    });

    return {
      user: {
        id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
        email: newUser.email,
      },
      token,
      refreshToken,
    };
  }

  async loginUser(loginData) {
    const { email, password } = loginData;

    if (!email || !password) {
      const error = new Error('ایمیل و رمز عبور الزامی هستند');
      error.statusCode = 400;
      throw error;
    }

    const User = await user.findOne({ email: email.toLowerCase() });
    if (!User || !(await User.comparePassword(password))) {
      const error = new Error('ایمیل یا رمز عبور اشتباه است');
      error.statusCode = 401;
      throw error;
    }

    User.tokenVersion = (User.tokenVersion || 0) + 1;
    await User.save();

    const token = generateToken(User);
    const refreshToken = generateRefreshToken(User);

    const refreshKey = `refresh:${User._id}`;
    await redisClient.set(refreshKey, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    return {
      user: {
        id: User.id,
        username: User.username,
        name: User.name,
        role: User.role,
        email: User.email,
      },
      token,
      refreshToken,
    };
  }

  async refreshToken(currentRefreshToken) {
    if (!currentRefreshToken) {
      const error = new Error('Refresh token وجود ندارد');
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(currentRefreshToken, '0698dbaf55aa108e77dd8013276c4e0f751d2854b26101b9233277bfcbf937bf');
    // const decoded = jwt.verify(currentRefreshToken, process.env.JWT_REFRESH_SECRET);

    const refreshKey = `refresh:${decoded.id}`;
    const savedRefreshToken = await redisClient.get(refreshKey);

    if (!savedRefreshToken || savedRefreshToken !== currentRefreshToken) {
      const error = new Error('Refresh token نامعتبر است یا logout شده');
      error.statusCode = 403;
      throw error;
    }

    const User = await user.findById(decoded.id);
    if (!User) {
      const error = new Error('کاربر یافت نشد');
      error.statusCode = 404;
      throw error;
    }

    const newAccessToken = generateToken(User);
    return { newAccessToken };
  }

  async logout(currentRefreshToken) {
    if (!currentRefreshToken) {
      const error = new Error('refreshToken وجود ندارد');
      error.statusCode = 400;
      throw error;
    }

    const decoded = jwt.verify(currentRefreshToken, process.env.JWT_REFRESH_SECRET);
    await redisClient.del(`refresh:${decoded.id}`);

    return true; // فقط تایید می‌کنیم که عملیات موفق بود
  }

  async forgetPassword(email) {
    const User = await user.findOne({ email });
    if (!User) {
      const error = new Error('کاربری با این ایمیل وجود ندارد');
      error.statusCode = 404;
      throw error;
    }

    const resetToken = User.createPasswordResetToken();
    await User.save({ validateBeforeSave: false });

    // اینجا می‌توانید منطق ارسال ایمیل را هم صدا بزنید
    return { resetToken };
  }

  async resetPassword(token, newPassword) {
    const hashedToken = require('crypto').createHash('sha256').update(token).digest('hex');

    const User = await user.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!User) {
      const error = new Error('توکن نامعتبر یا منقضی شده');
      error.statusCode = 400;
      throw error;
    }

    User.password = newPassword;
    User.resetPasswordToken = undefined;
    User.resetPasswordExpire = undefined;
    User.tokenVersion += 1;

    await User.save();
    return true;
  }
}
module.exports = new authService();
