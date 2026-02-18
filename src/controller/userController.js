const userService = require('../service/userService');

class userController {
    createUser(req, res) {
        userService.createNewUser(req, res);
    }
}
module.exports = new userController();
