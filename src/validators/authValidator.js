const { body } = require('express-validator');

class authValidator {
    registerValidation() {
        return [
            body('name')
                .notEmpty()
                .withMessage('نام الزامی است')
                .isLength({ min: 3 })
                .withMessage('نام باید حداقل 3 کاراکتر باشد'),

            body('username')
                .notEmpty()
                .withMessage('نام کاربری الزامی است')
                .isLength({ min: 3 })
                .withMessage('نام کاربری باید حداقل 3 کاراکتر باشد'),

            body('email')
                .notEmpty()
                .withMessage('ایمیل الزامی است')
                .isEmail()
                .withMessage('فرمت ایمیل صحیح نیست')
                .normalizeEmail(),

            body('password')
                .notEmpty()
                .withMessage('رمز عبور الزامی است')
                .isLength({ min: 6 })
                .withMessage('رمز عبور باید حداقل 6 کاراکتر باشد'),
            body('role')
                .notEmpty()
                .withMessage('هیچ نقشی برای کاربر در نظر گرفته نشده')
                .isLength({ max: 20 })
                .withMessage('کارکتر وارد شده بیش از حد مجاز'),
        ];
    }

    loginValidation() {
        return [
            body('email')
                .notEmpty()
                .withMessage('ایمیل الزامی است')
                .isEmail()
                .withMessage('فرمت ایمیل صحیح نیست')
                .normalizeEmail(),

            body('password')
                .notEmpty()
                .withMessage('رمز عبور الزامی است')
                .isLength({ min: 6 })
                .withMessage('رمز عبور بیش از حد مجاز کوتاه میباشد'),
        ];
    }
}

module.exports = new authValidator();
