const authService = require('../service/authServices');

class authController {
    login(req, res) {
        authService.loginUser(req, res);
    }
    register(req, res) {
        authService.registerUser(req, res);
    }
}
module.exports = new authController();
