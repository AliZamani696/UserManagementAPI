const express = require('express');
const router = express.Router();
const userController = require('./../controller/userController');

/**
 * @swagger
 * /api/users/create-user:
 *   post:
 *     summary: ایجاد کاربر جدید
 *     responses:
 *       200:
 *         description: موفقیت‌آمیز
 */
router.post('/create-user', userController.createUser);
/**
 * @swagger
 * /api/users/findUserWithId/{id}:
 *   get:
 *     summary: جستجوی کاربر با آیدی
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *       responses:
 *       200:
 *       description: موفق
 */
router.get(
    '/findUserWithUsername/:username',
    userController.findUserByUserName
);
router.get('/findUserWithId/:id', userController.findByUserID);
// router.post('/', userController.updateUser);
// router.post('/', userController.deleteUser);
// router.post('/', userController.getAllUsers);
// router.post('/', userController.comparePassword);
// router.post('/', userController.generateAuthToken);

module.exports = router;
