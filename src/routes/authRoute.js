const express = require('express');
const router = express.Router();
const authController = require('./../controller/authCotroller');

/**
 * @swagger
 * /api/users/create-user:
 * post:
 * summary: دریافت لیست تمام کاربران
 * responses:
 * 200:
 * description: موفقیت‌آمیز
 */
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
