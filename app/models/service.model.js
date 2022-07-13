const mongoose = require('mongoose');

const Service = mongoose.model(
    'Service',
    new mongoose.Schema({
        description: { type: String, required: true },
        price: { type: String, required: false },
        category: { type: String, required: true },
    })
);

module.exports = Service;