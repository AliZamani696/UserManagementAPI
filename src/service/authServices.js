class authService {
    async loginUser(req, res) {
        res.send('login route work');
    }
    async registerUser(req, res) {
        return res.send(req.body);
    }
}
module.exports = new authService();
