const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.user = require('./user.model');
db.role = require('./role.model');
db.ad = require('./ad.model');
db.employee = require('./employee.model');
db.service = require('./service.model');
db.category = require('./category.model');
db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;