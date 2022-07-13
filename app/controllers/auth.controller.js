const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
    const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles }
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    user.roles = roles.map(role => role._id);
                    const authorities = [`ROLE_${req.body.roles[0].toUpperCase()}`];
                    const token = jwt.sign({ id: user._id, isAdmin: true }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    user.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        res.status(200).send({
                            id: user._id,
                            email: user.email,
                            roles: authorities,
                            accessToken: token
                        });
                    });
                }
            );
        } else {
            Role.findOne({ name: 'user' }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                user.roles = [role._id];
                const authorities = ['ROLE_USER'];
                const token = jwt.sign({ id: user._id, isAdmin: false }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });

                user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.status(200).send({
                        id: user._id,
                        email: user.email,
                        roles: authorities,
                        accessToken: token
                    });
                });
            });
        }
    });
};


exports.login = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .populate('roles', '-__v')
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (!user) {
                return res.status(404).send({ message: 'Не е открит потребител с това име/парола.' });
            }
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: 'Не е открит потребител с това име/парола!'
                });
            }
            const userRoles = user.roles.map(role => role.name);
            const isAdmin = userRoles.includes('admin');
            const token = jwt.sign({ id: user._id, isAdmin: isAdmin }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            const authorities = [];
            for (let i = 0; i < user.roles.length; i++) {
                authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user._id,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
};