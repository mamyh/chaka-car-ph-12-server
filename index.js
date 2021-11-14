const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;


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
        const reviewCollection = database.collection('review');
        const ordersCollection = database.collection('orders');


        //users api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const exist = await usersCollection.findOne(query);
            if (!exist) {

                const result = await usersCollection.insertOne(user);
                res.send(result);
            }
        });
        app.get('/users/admin', async (req, res) => {
            const query = req.query;
            // console.log(query)
            const result = await usersCollection.findOne(query);
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
        });
        //products api post
        app.post('/products', async (req, res) => {
            const products = req.body;
            // console.log(products.file);
            // imgbb( products.file)
            //     .then((response) => console.log(response))
            //     .catch((error) => console.error(error));
            const result = await productsCollection.insertOne(products);
            res.send(result);
        });
        //get all the products
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result);
        });
        //get single products
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        })
        //delete products
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: objectId(id) };
            const result = await productsCollection.deleteOne(filter);
            res.send(result);
        });

        //review api
        app.post('/reviews', async (req, res) => {
            const data = req.body;
            const result = await reviewCollection.insertOne(data);
            res.send(result);
        });
        //get all reviews
        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find({}).toArray();
            res.send(result);
        });
        //orders api
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            res.send(result);
        });
        //get all the orders
        app.get('/orders', async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
        });

        //delete one order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: objectId(id) };
            const result = await ordersCollection.deleteOne(filter);
            res.send(result);
        });
        //change status
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: objectId(id) };
            const updateData = {
                $set: {
                    status: 'approved'
                }
            };
            const result = await ordersCollection.updateOne(filter, updateData);
            res.send(result);
        });
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

