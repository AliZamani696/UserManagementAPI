const authService = require('../service/authServices');
const { validationResult } = require('express-validator');

class authController {
  async authRegister(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: false,
          errors: errors.array().map((err) => err.msg),
        });
      }

      const userData = req.body;
      const result = await authService.registerUser(userData);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        status: true,
        data: { user: result.user },
        token: result.token,
        message: 'ثبت‌نام با موفقیت انجام شد',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        error: error.message || 'خطای سرور',
      });
    }
  }

  async authLogin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: false,
          errors: errors.array().map((err) => err.msg),
        });
      }
      const result = await authService.loginUser(req.body);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: true,
        data: { user: result.user },
        token: result.token,
        message: 'ورود با موفقیت انجام شد',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({ status: false, message: error.message + 'خطای سرور' });
    }
  }

  async authRefreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const result = await authService.refreshToken(refreshToken);

      return res.status(200).json({
        status: true,
        message: 'Access token جدید صادر شد',
        newAccessToken: result.newAccessToken,
      });
    } catch (error) {
      const statusCode = error.statusCode || 403;
      return res.status(statusCode).json({ status: false, message: error.message + 'خطای سرور' });
    }
  }

  async authLogout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      await authService.logout(refreshToken);

      res.clearCookie('refreshToken');

      return res.status(200).json({
        status: true,
        message: 'Logout موفقیت آمیز بود',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message + 'خطای سرور',
      });
    }
  }

  async authForgetPassword(req, res) {
    try {
      const result = await authService.forgetPassword(req.body.email);

      return res.status(200).json({
        status: true,
        message: 'لینک بازیابی رمز ارسال شد',
        resetPassToken: result.resetToken,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        //برای دیباگ پیام خطا رو برمیگردونم
        message: error.message + 'خطای سرور',
      });
    }
  }

  async authResetPassword(req, res) {
    try {
      await authService.resetPassword(req.params.token, req.body.password);

      return res.status(200).json({
        status: true,
        message: 'رمز عبور با موفقیت تغییر کرد',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message + 'خطای سرور',
      });
    }
  }
}
module.exports = new authController();
