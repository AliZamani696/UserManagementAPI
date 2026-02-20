const express = require('express');
const router = express.Router();
const userController = require('./../controller/userController');
const authMiddleware = require('./../middleware/authMiddleware');
const authValidator = require('./../validators/authValidator');
const limiter = require('./../middleware/limiterMiddleware');

router.post('/create-user', limiter, authMiddleware('admin', 'user'), authValidator.registerValidation(), userController.createUser);
router.get('/findUserWithUsername/:username', limiter, authMiddleware('admin', 'user'), userController.findUserByUserName);
router.get('/findUserWithId/:id', limiter, authMiddleware('admin', 'user'), userController.findByUserID);
router.put('/updateUser/:id', limiter, authMiddleware('admin', 'user'), userController.updateUser);
router.delete('/deleteUser/:id', limiter, authMiddleware('admin', 'user'), userController.deleteUser);
router.get('/allUsers', limiter, authMiddleware('admin', 'user'), userController.getAllUsers);

module.exports = router;
