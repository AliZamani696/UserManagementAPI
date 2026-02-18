const express = require('express');
const router = express.Router();
const userController = require('./../controller/userController');

router.post('/create-user', userController.createUser);
router.get(
    '/findUserWithUsername/:username',
    userController.findUserByUserName
);
router.get('/findUserWithId/:id', userController.findByUserID);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);
router.get('/allUsers', userController.getAllUsers);

module.exports = router;
