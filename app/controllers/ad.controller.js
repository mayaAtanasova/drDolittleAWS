const { ad } = require('../models');
const db = require('../models');

const Ad = db.ad;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

// Create and Save a new Ad
exports.create = (req, res) => {
    // Validate request
    if (!req.body.category ||
        !req.body.description ||
        !req.body.contactName ||
        !req.body.contactPhone) {
        res.status(400).send({ message: 'Полетата, отбелязани със * са задължителни!' });
        return;
    }
    // Create the Ad
    const ad = new Ad({
        category: req.body.category,
        description: req.body.description,
        contactPhone: req.body.contactPhone,
        contactEmail: req.body.contactEmail,
        contactName: req.body.contactName,
        owner: req.body.owner,
    });

    if (req.file && req.file.originalname) {
        ad.adImage = 'app/uploads/' + req.file.originalname;
    }
    // Save Ad in the database
    ad
        .save()
        .then(data => {
            const { _doc } = { ...data };
            res.send({
                message: 'Успешно създадохте обява.',
                _doc
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Грешка при създаването на обявата'
            });
        });
};

// Retrieve all Ads/find by category from the database.
exports.findAll = (req, res) => {
    const { page, size, category, owner } = req.query;
    let condition = {};

    if(category){
        condition.category = { $regex: new RegExp(category), $options: 'i' };
    }
    if(owner){
        condition.owner = owner;
    }

    const { limit, offset } = getPagination(page, size);

    Ad
        .paginate(condition, { offset, limit, populate: { path: 'category', select: 'name', lean: true } })
        .then(data => {
            res.send({
                totalItems: data.totalDocs,
                Ads: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1,
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Грешка при зареждането на обявите.'
            });
        });
};

exports.findLastThree = (req, res) => {
    Ad
        .find({})
        .then(data => {
            if (!data) {
                res.status(404).send({ message: 'Не са намерени обяви.' });
            } else { res.send(data.slice(-3)); };
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: 'Грешка при търсене на обява.' });
        });
};


// Find a single Ad with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Ad
        .findById(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: 'Не е намерена обява с id ' + id });
            } else { res.send(data._doc); };
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: 'Грешка при търсене на обява с id=' + id });
        });
};

// Update a Ad by the id in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body.category ||
        !req.body.description ||
        !req.body.contactName ||
        !req.body.contactPhone) {
        res.status(400).send({ message: 'Полетата, отбелязани със * са задължителни!' });
        return;
    }
    if (req.file && req.file.originalname) {
        req.body.adImage = 'app/uploads/' + req.file.originalname;
    } else {
        req.body.adImage = '/assets/ad_img.png';
    }
    const id = req.params.id;
    Ad.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Обява с id ${id} не може да бъде обновена. Може би не е намерена!`
                });
            } else {
                res.send({
                    message: 'Обявата е обновена успешно.'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Грешка при обновяване на обява с id' + id
            });
        });
};

// Delete a Ad with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Ad.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Обява с id ${id} не може да бъде изтрита. Може би не е намерена!`
                });
            } else {
                res.send({
                    message: 'Обявата е изтрита успешно!'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Обява с id' + id + 'не може да бъде изтрита.'
            });
        });
};

// Delete all Ads from the database.
exports.deleteAll = (req, res) => {
    Ad.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Обявите са изтрити успешно!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Грешка при изтриването на някои обяви.'
            });
        });
};
