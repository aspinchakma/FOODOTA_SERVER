const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())

require('dotenv').config();



app.get('/', (req, res) => {
    res.send('hello bro, server is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yu5z2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function server() {
    try {
        await client.connect();
        const database = client.db("foodota");
        const foodCollection = database.collection('foods');
        const orderCollection = database.collection('orders');

        // GET API FOR SHOW ALL FOODS ITEMS
        app.get('/foods', async (req, res) => {
            const query = {};
            const food = foodCollection.find(query);
            const foods = await food.toArray();
            res.send(foods)

        })
        // GET API FOR DETAILS BY ID
        app.get('/food/details/:id', async (req, res) => {
            const foodId = req.params.id;
            const query = { _id: ObjectId(foodId) };
            const foodDetails = await foodCollection.findOne(query);
            res.send(foodDetails)

        })
        //POST API FOR ORDER:
        app.post('/food/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        // GET API FOR MANAGE MY ORDER
        app.get('/myOrder/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const food = orderCollection.find(query);
            const myOrder = await food.toArray();
            res.send(myOrder)
        })


        // DELETE API FROM MY ORDER
        app.delete('/myOrder/deleteDetail', async (req, res) => {
            const deleteDetails = req.body;
            const { email, id } = deleteDetails;
            const query = { _id: ObjectId(id), email: email };
            const result = await orderCollection.deleteOne(query);
            console.log(result);
            res.send(result)
        })

        //GET API FOR MANAGE ALL 
        app.get('/manageAll', async (req, res) => {
            const query = {};
            const food = orderCollection.find(query);
            const orderedFoods = await food.toArray();
            res.send(orderedFoods)
        })


        // DELETE API FOR MANAGE ALL ITEMS

        app.delete('/manageAll/deleteDetails', async (req, res) => {
            const query = { _id: ObjectId(req.body.id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })

        // POST API FOR RESTAURANT

        app.post('/add/sellMeal', async (req, res) => {
            const newItems = req.body;
            const result = await foodCollection.insertOne(newItems);
            res.send(result);
        })

        // UPDATE API FOR UPDATE STATUS:

        app.patch('/food/status', async (req, res) => {
            const foodId = req.body.id;
            const filter = { _id: ObjectId(foodId) };


            const updatedValue = { $set: { "food.status": 'Approved' } }
            const result = await orderCollection.updateOne(filter, updatedValue);
            res.send(result);
        })

    }
    finally {
        // await client.close();

    }
}

server().catch(console.dir)



app.listen(port, () => {
    console.log('inside ', port)
})