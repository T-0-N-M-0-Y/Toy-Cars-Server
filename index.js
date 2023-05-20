const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.ddbcqih.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const dataCollection = client.db("toyCars").collection("allData");

        app.get('/alldata', async (req, res) => {
            const result = await dataCollection.find().toArray();
            res.send(result);
        })

        const userAddedData = client.db("toyCars").collection("userDataCollection");

        app.post('/newtoy', async (req, res) => {
            const newToy = req.body;
            const result = await userAddedData.insertOne(newToy);
            res.send(result);
        })

        app.get('/newtoy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userAddedData.findOne(query);
            res.send(result);
        })

        app.get('/newtoy', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const options = {
                sort: { title: 1 }
            };
            const result = await userAddedData.find(query, options).toArray();
            res.send(result);
        })

        app.delete ('/newtoy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userAddedData.deleteOne(query);
            res.send(result);
        })
        app.get ('/newtoy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userAddedData.findOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})