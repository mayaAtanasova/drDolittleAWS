const mongoose = require('mongoose');

const Employee = mongoose.model(
    'Employee',
    new mongoose.Schema({
        name: { type: String, required: true },
        description: { type: String, required: true },
        picture: { type: String, required: false }
    })
);
module.exports = Employee;