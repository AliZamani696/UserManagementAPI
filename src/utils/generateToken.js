const jwt = require('jsonwebtoken');

const generateToken = (user, expiresIn = '1h') => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    '0698dbaf55aa108e77dd8013276c4e0f751d2854b26101b9233277bfcbf937bf',
    {
      expiresIn: expiresIn,
    }
    // برای توکن های کوتاه مدت از JWT_ACCESS_SECRET
    //     process.env.JWT_ACCESS_SECRET,
    // { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    '0698dbaf55aa108e77dd8013276c4e0f751d2854b26101b9233277bfcbf937bf',
    { expiresIn: '7d' }
    // process.env.JWT_REFRESH_SECRET,
    // { expiresIn: process.env.JWT_REFRESH_EXPIRES }
  );
};

module.exports = { generateToken, generateRefreshToken };
