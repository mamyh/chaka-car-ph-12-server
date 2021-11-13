const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');


require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;
//middleware 
app.use(cors());
app.use(express.json());

//connectino to the mongodb database 
const uri = `mongodb+srv://${process.env.CAR_DB_USER}:${process.env.CAR_DB_PASSWORD}@cluster0.lt029.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('car-sale');
        const usersCollection = database.collection('users');
        const productsCollection = database.collection('products');

        //users api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        app.post('/users/admin', async (req, res) => {
            const { email } = req.body;
            const result = await usersCollection.findOne({ email });
            res.send(result);
        })
        app.put('/users', async (req, res) => {
            const userData = req.body;
            const filter = { email: userData.newAdmin };
            const updateData = {
                $set: {
                    role: 'admin'
                }
            };
            const result = await usersCollection.updateOne(filter, updateData);
            res.send(result);
        })
    } finally {
        //client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello car saller');
});

app.listen(port, () => {
    console.log('listening to the port ', port);
})

