const mongoose = require('mongoose');

const ServiceCategory = mongoose.model(
    'ServiceCategory',
    new mongoose.Schema({
        name: {type: String, required: true}
    })
);

module.exports = ServiceCategory;