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
        const foodCollection = database.collection('foods')

        app.get('/foods', async (req, res) => {
            const query = {};
            const food = foodCollection.find(query);
            const foods = await food.toArray();
            res.send(foods)
            console.log('foods length', foods.length)
        })

        app.get('/food/details/:id', async (req, res) => {
            const foodId = req.params.id;
            const query = { _id: ObjectId(foodId) };
            const foodDetails = await foodCollection.findOne(query);
            res.send(foodDetails)

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