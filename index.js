const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

app.get ('/', (req, res) => {
      res.send("server is for visa data")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p5jac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const visaCollection = client.db("visasDB").collection("visas");
    
    app.get('/visas', async (req, res) => {
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // filter visa type
    app.get('/visas/:type', async (req, res) => {
      const type = req.params.type;
      const query = {visaType:type}
      const result = await visaCollection.find(query).toArray()
      res.send(result);
    })
    // visa details based on _id
    app.get('/visas/single/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.findOne(query);
      res.send(result);
  })

    app.post('/visas', async(req , res)=>{
      const visa = req.body;
      const result = await visaCollection.insertOne(visa);
      res.send(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port , ()=>{
    console.log(`server is running on ${port}`)
})