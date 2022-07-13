const { service } = require('../models');
const db = require('../models');

const Service = db.service;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.category ||
        !req.body.description ||
        (!req.body.description && !req.body.price)) {
        return res.status(400).send({ message: "Описанието е задължително" });
    }
    // Create the Service
    const service = new Service({
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
    });
    //save Service in the database
    service
        .save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Грешка при създаването на услугата'
            });
        });
};

exports.findAll = (req, res) => {

    Service
        .find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Грешка при получаването на услугите'
            });
        });
}

exports.update = (req, res) => {
    // Validate Request
    if (!req.body.category ||
        !req.body.description ||
        (!req.body.description && !req.body.price)) {
        res.status(400).send({ message: 'Описанието е задължително' });
        return;
    }
    // Find and update Service with the request body
    Service
        .findByIdAndUpdate(req.params.id, {
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Грешка при редактирането на услугата'
            });
        });
}

exports.delete = (req, res) => {
    Service
        .findByIdAndRemove(req.params.id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Грешка при изтриването на услугата'
            });
        }
        );
}

exports.deleteMany = (req, res) => {
    const ids = req.body;

    Service
        .deleteMany({ _id: { $in: ids } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Грешка при изтриването на услугите'
            });
        }
        );
}