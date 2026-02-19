const express = require('express');
const router = express.Router();
const userController = require('./../controller/userController');
const authMiddleware = require('./../middleware/authMiddleware');
const authValidator = require('./../validators/authValidator');
const limiter = require('./../middleware/limiterMiddleware');

router.post(
    '/create-user',
    limiter,
    authMiddleware('admin'),
    authValidator.registerValidation(),
    userController.createUser
);
router.get(
    '/findUserWithUsername/:username',
    limiter,
    authMiddleware('admin'),
    userController.findUserByUserName
);

router.get(
    '/findUserWithId/:id',
    limiter,
    authMiddleware('admin'),
    userController.findByUserID
);

router.put(
    '/updateUser/:id',
    limiter,
    authMiddleware('admin'),
    userController.updateUser
);

router.delete(
    '/deleteUser/:id',
    limiter,
    authMiddleware('admin'),
    userController.deleteUser
);

router.get(
    '/allUsers',
    limiter,
    authMiddleware('admin'),
    userController.getAllUsers
);

module.exports = router;
