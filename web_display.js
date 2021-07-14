const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const PORT = process.env.PORT || 8080;

const routes = require('./app/routes/api');

const dbName = "lora_wan";

// Connection URL
const url = 'mongodb://localhost:27017';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected',() => {
  console.log('Mongoose is connected!!!');
}) 

const client = new MongoClient(url);

//app.set('view engine', 'ejs')

app.get('/sensor_data', (req,res) => {
  const db = client.db(dbName);
  // Get the documents collection
  const collection = db.collection('sensor_data');
  collection.find({}).toArray(function(err, device_list) {
    assert.strictEqual(err, null);
    res.render('sensor_data', {'sensor_data': device_list})
  });
})

//data parsing
app.use(express.json());
app.use(express.urlencoded({extended: false}));

client.connect((err) => {
  assert.strictEqual(null,err);
});

app.use(morgan('tiny'));
app.use('/',routes);



app.listen(PORT,console.log(`Server is starting at ${PORT}`));



