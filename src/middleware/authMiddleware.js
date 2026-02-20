const jwt = require('jsonwebtoken');
const user = require('./../schemas/userSchema');

const authMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          status: false,
          message: 'توکن ارسال نشده است',
        });
      }
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(
        token,
        // process.env.JWT_ACCESS_SECRET
        '0698dbaf55aa108e77dd8013276c4e0f751d2854b26101b9233277bfcbf937bf'
      );

      const User = await user.findById(decoded.id).select('-password -__v');
      if (!User) {
        return res.status(401).json({
          status: false,
          message: 'کاربر یافت نشد',
        });
      }
      if (decoded.tokenVersion !== User.tokenVersion) {
        return res.status(401).json({
          status: false,
          message: 'توکن باطل شده است، لطفاً دوباره وارد حساب کاربری خود شوید',
        });
      }
      req.user = User;

      if (roles.length > 0 && !roles.includes(User.role)) {
        return res.status(403).json({
          status: false,
          message: 'شما دسترسی لازم را ندارید',
        });
      }
      next();
    } catch (error) {
      return res.status(401).json({
        status: false,
        message: 'توکن نامعتبر است یا منقضی شده',
        error: error.message,
      });
    }
  };
};

module.exports = authMiddleware;
