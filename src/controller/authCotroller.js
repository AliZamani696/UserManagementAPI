const authService = require('../service/authServices');

class authController {
    authRegister(req, res) {
        authService.registerUser(req, res);
    }
    authLogin(req, res) {
        authService.loginUser(req, res);
    }
    authLogout(req, res) {
        authService.logout(req, res);
    }
    authRefreshToken(req, res) {
        authService.refreshToken(req, res);
    }
    authForgetPassword(req, res) {
        authService.forgetPassword(req, res);
    }
    authRestPassword(req, res) {
        authService.restPassword(req, res);
    }
}
module.exports = new authController();
