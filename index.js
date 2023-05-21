const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.azmaoyl.mongodb.net/?retryWrites=true&w=majority`;

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
    const toysCollection = client.db("ToysVendor").collection('allToys');

    // add toy in db
    app.post('/alltoys', async(req,res) => {
        const toys = req.body;
        console.log(toys);
        const result = await toysCollection.insertOne(toys);
        res.send(result);
    })

    // find toys by user email 
    app.get('/alltoys', async(req, res) =>{
        console.log(req.query.email);
        let query = {}
        if (req.query?.email) {
            query = {email: req.query.email}
        }
        const result = await toysCollection.find(query).toArray();
        res.send(result);
    })


    // delete Toys 

    app.delete('/alltoys/:id', async(req,res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await toysCollection.deleteOne(query);
        res.send(result)
        
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





app.get("/", (req, res) => {
  res.send("Kids vendor Server");
});

app.listen(port, () => {
  console.log(`server running with port  ${port}`);
});
