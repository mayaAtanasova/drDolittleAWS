const verifyRegister = require('../middleware/verifyRegister');
const controller = require('../controllers/auth.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });
    app.post(
        '/register',
        [
            verifyRegister.checkDuplicateUser,
            verifyRegister.checkRolesExisteance
        ],
        controller.register
    );
    app.post('/login', controller.login);
};