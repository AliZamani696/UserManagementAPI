const express = require('express');
const router = express.Router();
const userController = require('./../controller/userController');

router.post('/create-user', userController.createUser);
// router.post('/', userController.findUserByUsername);
// router.post('/', userController.findUserById);
// router.post('/', userController.updateUser);
// router.post('/', userController.deleteUser);
// router.post('/', userController.getAllUsers);
// router.post('/', userController.comparePassword);
// router.post('/', userController.generateAuthToken);

module.exports = router;
