const express = require('express');
const router = express.Router();
const authController = require('./../controller/authCotroller');
const authValidator = require('./../validators/authValidator');
const authMiddleware = require('./../middleware/authMiddleware');
const limiter = require('../middleware/limiterMiddleware');

router.post('/refresh', authMiddleware(), authController.refreshToken);
router.post(
    '/login',
    limiter,
    authValidator.loginValidation(),
    authController.login
);
router.post(
    '/register',
    limiter,
    authValidator.registerValidation(),
    authController.register
);
router.post('/logout', limiter, authController.logout);

module.exports = router;
