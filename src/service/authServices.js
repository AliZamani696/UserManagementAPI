const user = require('./../schemas/userSchema');

class authService {
    async loginUser(req, res) {}
    async registerUser(req, res) {
        return res.send(req.body);
    }
}
module.exports = new authService();
