const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        '0698dbaf55aa108e77dd8013276c4e0f751d2854b26101b9233277bfcbf937bf',
        {
            expiresIn: '1d',
        }
    );
};

module.exports = generateToken;
