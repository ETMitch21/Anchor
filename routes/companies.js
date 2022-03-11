const assert = require('assert');
const { ObjectId } = require('mongodb');

module.exports = (function() {
    'use strict';
    var companyRoutes = require('express').Router();
    const database = require('../config/db');

    // Check if a company slug exists
    companyRoutes.get('/slug/:slug', async function (req, res) {
        res.status(200).send((await (await database.run()).collection('companies').find({ slug : req.params.slug }).toArray()).length > 0 ? false : true);
    });

    // Create a Company
    companyRoutes.post('/', async function (req, res) {
        let objectId = new ObjectId();
        assert.equal(24, objectId.toHexString().length);
        (await database.run()).collection('companies').insertOne({ _id: objectId, ...req.body }).then((documents) => {
            res.status(200).json({ 'results': documents, 'timestamp' : new Date().toUTCString() }).send();
        }).catch((error) => {
            res.status(500).send(error.message);
        });
    });

    // Reads all the companies
    companyRoutes.get('/', async function (req, res) {
        (await database.run()).collection('companies').find().toArray().then((documents) => {
            res.status(200).json({ 'results': documents, 'timestamp' : new Date().toUTCString() }).send();
        }).catch((error) => {
            res.status(500).send(error.message);
        });
    });

    // Reads a single company
    companyRoutes.get('/:companyId', async function (req, res) {
        (await database.run()).collection('companies').findOne({ '_id' : { $in : [ObjectId(req.params.companyId)] } }).then((results) => {
            res.status(200).json({ 'results': results, 'timestamp' : new Date().toUTCString() }).send();
        }).catch((error) => {
            res.status(500).send(error.message);
        });
    });

    // Updates a single company
    companyRoutes.put('/:companyId', async function (req, res) {
        (await database.run()).collection('companies').updateOne({ '_id' : { $in : [ObjectId(req.params.companyId)] } }, { $set: { ...req.body } }).then((results) => {
            res.status(200).json({ 'results': results, 'timestamp' : new Date().toUTCString() }).send();
        }).catch((error) => {
            res.status(500).send(error.message);
        });
    });

    // Deletes a single company
    companyRoutes.delete('/:companyId', async function (req, res) {
        (await database.run()).collection('companies').deleteOne({ '_id' : { $in : [ObjectId(req.params.companyId)] } }).then((results) => {
            res.status(200).json({ 'results': results, 'timestamp' : new Date().toUTCString() }).send();
        }).catch((error) => {
            res.status(500).send(error.message);
        });
    });

    return companyRoutes;
})();