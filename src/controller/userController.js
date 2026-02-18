const userService = require('../service/userService');
const autoBind = require('auto-bind');

class userController {
    constructor() {
        autoBind(this);
    }
    createUser(req, res) {
        userService.createNewUser(req, res);
    }
    findUserByUserName(req, res) {
        userService.findUserByUsername(req, res);
    }
}
module.exports = new userController();
