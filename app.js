require('dotenv').config();

const request = require('request');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const port = process.env.PORT || 3000;

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

const app = express();
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('combined'));

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.auth0Domain}.well-known/jwks.json`
    }),
    audience: process.env.auth0Audience,
    issuer: process.env.auth0Domain,
    algorithms: ['RS256']
});

const userRoutes = require('./routes/users');
const companyRoutes = require('./routes/companies');

app.post('/authorization', async (req, res) => {
    var options = {
        method: 'POST',
        url: `${process.env.auth0Domain}oauth/token`,
        headers: {
            'content-type' : 'application/json'
        },
        body: JSON.stringify({
            'grant_type' : 'password',
            'username' : req.body.username,
            'password' : req.body.password,
            'client_id' : process.env.auth0Client,
            'client_secret' : process.env.auth0Secret,
            'audience' : process.env.auth0Audience
        })
    }
    request(options, function(error, response, body) {
        if(error) res.status(500).send(error);

        let result = JSON.parse(body);

        if(result.error) {
            res.status(500).send(result.error_description);
        } else {
            res.status(200).send({ 'access_token' : result.access_token });
        }
    });
});

app.use(checkJwt);
app.use('/users', userRoutes);
app.use('/companies', companyRoutes);

app.listen(port, () => {
    console.log(`Anchor is listening at http://localhost:${port}`);
});