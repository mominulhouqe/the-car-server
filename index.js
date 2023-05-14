const express = require('express')
const app = express()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000


// midleWare
app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
    res.send("Car Doctor Server is Running")
})
console.log();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.34btmna.mongodb.net/?retryWrites=true&w=majority`;


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



const carCollection = client.db('the-car').collection('carDoctor');
const bookingCollection = client.db('the-car').collection('booking')

app.get('/service', async(req, res ) => {
    const cursor = carCollection.find();
    const results = await cursor.toArray();
    res.send(results)
})

app.get('/service/:id', async(req, res) => {
    
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}

    const options = {
        projections : {title: 1, price: 1, service_id: 1,}
    }
    const user = await carCollection.findOne(query, options);
    res.send(user)

})

// booking

app.get('/booking/:id', async(req, res) => {
console.log(req.query);
let query = {};
if(req.query?.email){
  query = {email: req.query.email}
}
  const result = await bookingCollection.find(query).toArray();
res.send(result)

})
// add booking
// app.post('/booking', async(req, res ) => {
//   const user = req.body;
//   console.log('user get', user);
//   const results = await bookingCollection.insertOne(user);
//   console.log('added user', results);
//   res.send(results)
// })

// adding booked
app.post('/booking', async(req, res) => {
  const user = req.body;
  user._id = new ObjectId(); // Generate a new ObjectId for _id
  console.log('user get', user);
  const results = await bookingCollection.insertOne(user);
  console.log('added user', results);
  res.send(results);
});




// get data From booking
app.get('/booking/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const user = await bookingCollection.findOne(query);
  res.send(user)
})



// delete data mongodb
app.delete('/booking/:id', async(req, res ) => {
  const id = req.params.id;
  console.log('plase delete  from database');
  const query = {_id: new ObjectId(id)};
  const result = await bookingCollection.deleteOne(query);
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




app.listen(port, async () => {
    try {
        await run();
        console.log(`Car Doctor is Running on Port: ${port}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
});
