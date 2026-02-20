const { body } = require('express-validator');
const { validationResult } = require('express-validator');

class authValidator {
  static registerValidation() {
    return [
      body('name').notEmpty().withMessage('نام الزامی است').isLength({ min: 3 }).withMessage('نام باید حداقل 3 کاراکتر باشد'),

      body('username').notEmpty().withMessage('نام کاربری الزامی است').isLength({ min: 3 }).withMessage('نام کاربری باید حداقل 3 کاراکتر باشد'),

      body('email').notEmpty().withMessage('ایمیل الزامی است').isEmail().withMessage('فرمت ایمیل صحیح نیست').normalizeEmail(),

      body('password')
        .isLength({ min: 8 })
        .withMessage('پسورد باید حداقل ۸ کاراکتر باشد')
        .matches(/[A-Z]/)
        .withMessage('پسورد باید حداقل شامل یک حرف بزرگ باشد')
        .matches(/[a-z]/)
        .withMessage('پسورد باید حداقل شامل یک حرف کوچک باشد')
        .matches(/[0-9]/)
        .withMessage('پسورد باید حداقل شامل یک عدد باشد')
        .matches(/[!@#$%^&*]/)
        .withMessage('پسورد باید شامل حداقل یک کاراکتر خاص باشد'),

      body('role').notEmpty().withMessage('هیچ نقشی برای کاربر در نظر گرفته نشده').isLength({ max: 20 }).withMessage('کارکتر وارد شده بیش از حد مجاز'),
    ];
  }

  static loginValidation() {
    return [
      body('email').notEmpty().withMessage('ایمیل الزامی است').isEmail().withMessage('فرمت ایمیل صحیح نیست').normalizeEmail(),

      body('password')
        .isLength({ min: 8 })
        .withMessage('پسورد باید حداقل ۸ کاراکتر باشد')
        .matches(/[A-Z]/)
        .withMessage('پسورد باید حداقل شامل یک حرف بزرگ باشد')
        .matches(/[a-z]/)
        .withMessage('پسورد باید حداقل شامل یک حرف کوچک باشد')
        .matches(/[0-9]/)
        .withMessage('پسورد باید حداقل شامل یک عدد باشد')
        .matches(/[!@#$%^&*]/)
        .withMessage('پسورد باید شامل حداقل یک کاراکتر خاص باشد'),
    ];
  }
}

module.exports = authValidator;
