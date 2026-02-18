const authService = require('../service/authServices');

class authController {
    register(req, res) {
        authService.registerUser(req, res);
    }
    login(req, res) {
        authService.loginUser(req, res);
    }
}
module.exports = new authController();
