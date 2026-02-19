const express = require('express');
const router = express.Router();
const authController = require('./../controller/authCotroller');
const authValidator = require('./../validators/authValidator');
const authMiddleware = require('./../middleware/authMiddleware');

router.post('/refresh', authMiddleware(), authController.refreshToken);
router.post('/login', authValidator.loginValidation(), authController.login);
router.post(
    '/register',
    authValidator.registerValidation(),
    authController.register
);
router.post('/logout', authController.logout);

module.exports = router;
