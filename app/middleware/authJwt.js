const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }
        req.userId = decoded.id;
        next();
    });
};

const isAdmin = (req, res, next) => {

    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    };

    const decoded = jwt.decode(token);
    if(!decoded.isAdmin) {
        return res.status(401).send({ message: 'Unauthorized!' });

    }

    User.findById(decoded.id, (err, user) => {
        if (err) {
            return res.status(500).send({ message: 'Грешка при намиране на потребителя' });
        }
        if (!user) {
            return res.status(404).send({ message: 'Потребителят не е намерен' });
        }
    });
    
    next();
};

const authJwt = {
    verifyToken,
    isAdmin,
};
module.exports = authJwt;