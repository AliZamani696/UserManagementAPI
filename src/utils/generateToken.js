const jwt = require('jsonwebtoken');

const generateToken = (user, expiresIn = '1h') => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    // '0698dbaf55aa108e77dd8013276c4e0f751d2854b26101b9233277bfcbf937bf',
    process.env.JWT_SECRET,
    // {
    //   expiresIn: expiresIn,
    // }
    // برای توکن های کوتاه مدت از JWT_ACCESS_SECRET
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || expiresIn }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    // '0698dbaf55aa108e77dd8013276c4e0f751d2854b26101b9233277bfcbf937bf',
    // { expiresIn: '7d' }
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );
};

module.exports = { generateToken, generateRefreshToken };
