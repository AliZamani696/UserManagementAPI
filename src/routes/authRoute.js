const express = require('express');
const router = express.Router();
const authController = require('./../controller/authCotroller');
const authValidator = require('./../validators/authValidator');

router.post('/login', authValidator.loginValidation(), authController.login);
router.post(
    '/register',
    authValidator.registerValidation(),
    authController.register
);

module.exports = router;
