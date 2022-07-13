if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./app/models');
const Role = db.role;
const path = __dirname + '/app/views';
const imgPath = __dirname + '/app/uploads';

var corsOptions = {
    origin: [
        'http://localhost:8081',
        'http://localhost:4200',
    ]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/app/uploads', express.static(imgPath));
app.use(express.static(path));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(path + 'index.html');
});

app.get('/app/uploads/:id', (req, res) => {
    res.sendFile(imgPath + '/id');
});

require('./app/routes/auth.routes')(app);
require('./app/routes/ad.routes')(app);
require('./app/routes/services.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

db.mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfully connect to MongoDB.');
        initial();
    })
    .catch(err => {
        console.error('Database connection error', err);
        process.exit();
    });

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: 'user'
            }).save(err => {
                if (err) {
                    console.log('error', err);
                }
                console.log('added \'user\' to roles collection');
            });
            new Role({
                name: 'moderator'
            }).save(err => {
                if (err) {
                    console.log('error', err);
                }
                console.log('added \'moderator\' to roles collection');
            });
            new Role({
                name: 'admin'
            }).save(err => {
                if (err) {
                    console.log('error', err);
                }
                console.log('added \'admin\' to roles collection');
            });
        }
    });
}