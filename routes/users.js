const assert = require('assert');
const { ObjectId } = require('mongodb');

module.exports = (function() {
    'use strict';
    var userRoutes = require('express').Router();
    const database = require('../config/db');

    // Create a User
    userRoutes.post('/', async function (req, res) {
        let objectId = new ObjectId();
        assert.equal(24, objectId.toHexString().length);
        (await database.run()).collection('users').insertOne({ _id: objectId, ...req.body }).then((documents) => {
            res.status(200).json({ 'results': documents, 'timestamp' : new Date().toUTCString() }).send();
        }).catch((error) => {
            res.status(500).send(error.message);
        });
    });

    // Reads all the users
    userRoutes.get('/', async function (req, res) {
        (await database.run()).collection('users').find().toArray().then((documents) => {
            res.status(200).json({ 'results': documents, 'timestamp' : new Date().toUTCString() }).send();
        }).catch((error) => {
            res.status(500).send(error.message);
        });
    });

    // Reads a single user
    userRoutes.get('/:userId', async function (req, res) {
        (await database.run()).collection('users').findOne({ '_id' : { $in : [ObjectId(req.params.userId)] } }).then((results) => {
            res.status(200).json({ 'results': results, 'timestamp' : new Date().toUTCString() }).send();
        }).catch((error) => {
            res.status(500).send(error.message);
        });
    });

    // Updates a single user
    userRoutes.put('/:userId', async function (req, res) {
        (await database.run()).collection('users').updateOne({ '_id' : { $in : [ObjectId(req.params.userId)] } }, { $set: { ...req.body } }).then((results) => {
            res.status(200).json({ 'results': results, 'timestamp' : new Date().toUTCString() }).send();
        }).catch((error) => {
            res.status(500).send(error.message);
        });
    });

    // Deletes a single user
    userRoutes.delete('/:userId', async function (req, res) {
        (await database.run()).collection('users').deleteOne({ '_id' : { $in : [ObjectId(req.params.userId)] } }).then((results) => {
            res.status(200).json({ 'results': results, 'timestamp' : new Date().toUTCString() }).send();
        }).catch((error) => {
            res.status(500).send(error.message);
        });
    });

    return userRoutes;
})();