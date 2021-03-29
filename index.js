const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wxd1m.mongodb.net/${process.env.BD_DATABASE}?retryWrites=true&w=majority`
app.use(bodyParser.json())
app.use(cors())
const port = 4000




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJhonStore").collection("data");
  const orderCollection = client.db("emaJhonStore").collection("order");

    app.post('/product',(req,res)=>{
        const product=req.body;
        collection.insertOne(product)
        .then(result=>{
            console.log(result);
        })
    })

    app.get('/products',(req,res)=>{
        collection.find()
        .toArray((err,document)=>{
            res.send(document)
        })
    })
    app.get('/products/:key',(req,res)=>{
        collection.find({key:req.params.key})
        .toArray((err,document)=>{
            res.send(document[0])
        })
    })
    app.post('/productsKeys',(req,res)=>{
        const productKey=req.body
        collection.find({key:{$in: productKey }})
        .toArray((err,result)=>{
            res.send(result)
        })
    })
    app.post('/addOrder',(req,res)=>{
        const order=req.body;
        orderCollection.insertOne(order)
        .then(result=>{
            res.send(result.insertedCount > 0);
        })
    })
});

app.listen(process.env.PORT || port)