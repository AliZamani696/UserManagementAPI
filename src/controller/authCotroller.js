const authService = require('../service/authServices');

class authController {
    register(req, res) {
        authService.registerUser(req, res);
    }
    login(req, res) {
        authService.loginUser(req, res);
    }
    logout(req, res) {
        authService.logout(req, res);
    }
    refreshToken(req, res) {
        authService.refreshToken(req, res);
    }
}
module.exports = new authController();
