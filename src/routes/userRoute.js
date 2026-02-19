const express = require('express');
const router = express.Router();
const userController = require('./../controller/userController');
const authMiddleware = require('./../middleware/authMiddleware');
const authValidator = require('./../validators/authValidator');

router.post(
    '/create-user',
    authMiddleware('admin'),
    authValidator.registerValidation(),
    userController.createUser
);
router.get(
    '/findUserWithUsername/:username',
    authMiddleware('admin'),
    userController.findUserByUserName
);
router.get(
    '/findUserWithId/:id',
    authMiddleware('admin'),
    userController.findByUserID
);
router.put(
    '/updateUser/:id',
    authMiddleware('admin'),
    userController.updateUser
);
router.delete(
    '/deleteUser/:id',
    authMiddleware('admin'),
    userController.deleteUser
);
router.get('/allUsers', authMiddleware('admin'), userController.getAllUsers);

module.exports = router;
