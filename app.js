require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({
    extended: true
}));

const port = process.env.PORT || 3000;

const userRoutes = require('./routes/users');

app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Anchor is listening at http://localhost:${port}`);
});