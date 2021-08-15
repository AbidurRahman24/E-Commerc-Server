const express = require('express')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
var cors = require('cors')

require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dyzwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("Ecommerce").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post('/addProduct', (req, res) => {
    const product = req.body
    productCollection.insertMany(product)
      .then(result => {
        res.send(result.insertedCount)
      })
  })
  // Read Data
  app.get('/products', (req, res) => {
    productCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  // Signle Product find
  app.get('/product/:key', (req, res) => {
    productCollection.find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productCollection.find({key: { $in: productKeys} })
    .toArray( (err, documents) => {
        res.send(documents);
    })
})
 
app.post('/addOrder', (req, res) => {
  const order = req.body;
  ordersCollection.insertOne(order)
  .then(result => {
      res.send(result.insertedCount > 0)
  })
})


});

app.get('/', (req, res) => {
  res.send('Hello World today!')
})
const port = 5000
app.listen(process.env.PORT || port)