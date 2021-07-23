const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
//require('dotenv').config()
require('dotenv').config()



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l47bs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eigw8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://vln:vlnijk@cluster0.eigw8.mongodb.net/VolunteerMain?retryWrites=true&w=majority";

const app = express()
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  //const activitiesCollection = client.db(`${process.env.DB_NAME}`).collection("Activities");
  const activitiesCollection = client.db(`${process.env.DB_NAME}`).collection(`Activities`);
  const registerVolunteerCollection = client.db(`${process.env.DB_NAME}`).collection(`Registration`);
  // const registerVolunteerCollection = client.db(`${process.env.DB_NAME}`).collection("Registration");


    app.get('/allActivity', (req, res) => {
      activitiesCollection.find({})
      .toArray( (err, documents) =>{
        res.send(documents)
      })
    })

    app.post('/newRegister', (req, res) =>{
      const registration = req.body;
      registerVolunteerCollection.insertOne(registration)
      .then(result => {
        res.send(result.insertedCount > 0);
        console.log(result)
      })
    })

    app.get('/allVolunteerList', (req, res) => {
      registerVolunteerCollection.find({})
      .toArray( (err, documents) => {
        res.send(documents)
      })
    })

    app.post('/addEvent', (req, res) => {
      const event = req.body;
      activitiesCollection.insertOne(event)
      .then(result => {
        res.send(result.insertedCount > 0);
        console.log(result.insertedCount);
      })
    })

    app.get('/specificVolunteer', (req, res) => {
      console.log(req.query.email);
      registerVolunteerCollection.find({email: req.query.email})
      .toArray( (err, documents) => {
        res.send(documents)
      })
    })

    app.delete('/deleteVolunteer/:id', (req, res) => {
      registerVolunteerCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send(result.deletedCount > 0);
        console.log('delete successfully');
      })
    })
    console.log("database connected");
});

app.listen(8000, () => {
	console.log('Server Works !!! At port 8000');
});