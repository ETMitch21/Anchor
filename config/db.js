const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.mongoUsername}:${process.env.mongoPassword}@${process.env.mongoCluser}.ch5rf.mongodb.net/${process.env.mongoDatabase}?retryWrites=false&w=majority`;

const client = new MongoClient(uri);

async function run() {
    await client.connect();

    await client.db(process.env.mongoDatabase).command({ ping: 1 });

    console.log("Connected successfully to server with database ANCHOR.");

    return client.db(process.env.mongoDatabase);   
}

module.exports = { run }