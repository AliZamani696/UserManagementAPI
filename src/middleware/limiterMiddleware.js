const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 2,
    message: {
        status: false,
        message: 'تلاش‌های ناموفق بیش از حد. 10 دقیقه دیگر تلاش کنید',
    },
});
module.exports = limiter;
