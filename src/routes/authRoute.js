const express = require('express');
const router = express.Router();
const authController = require('./../controller/authCotroller');
const authValidator = require('./../validators/authValidator');
const authMiddleware = require('./../middleware/authMiddleware');
const limiter = require('../middleware/limiterMiddleware');

router.post('/refresh', authMiddleware(), authController.authRefreshToken);
router.post('/login', limiter, authValidator.loginValidation(), authController.authLogin);
router.post('/register', limiter, authValidator.registerValidation(), authController.authRegister);
router.post('/logout', limiter, authController.authLogout);
router.post('/forget-password', limiter, authController.authForgetPassword);
router.patch('/reset-password/:token', limiter, authController.authResetPassword);

module.exports = router;
