const express = require('express')
const app = express()
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const assert = require('assert');

var data_model = require('./app/models/data.model')

const PORT = process.env.PORT || 8080;

const routes = require('./app/routes/routes');

// Connection URL
const url = 'mongodb://localhost:27017/data_sensor';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected',() => {
  console.log('Mongoose is connected!!!');
}) 

/*
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
client.connect((err) => {
  assert.strictEqual(null,err);
});
*/
var mqtt = require('mqtt');  
var mongodb = require('mongodb');
var mongodbClient = mongodb.MongoClient;

const db_name = "lora_wan";
const collection_name = "sensor_data";
const uri = "mongodb://localhost:27017/iot_data";

mqtt_options={
    clientId:"F5JJ4TAAXSNV3BPVW2J36IJPOKZ2UIK7XMPDSSI",
    username:"bkiotlab-lorawapp@ttn",
    password:"NNSXS.F5JJ4TAAXSNV3BPVW2J36IJPOKZ2UIK7XMPDSSI.SICOM5YBB5WLTXIN4QZWXHE6AYTFJIH37AR45BWHB5IRYNUJSFZA",
    clean:true
};

mqtt_topics_list = [
    "v3/bkiotlab-lorawapp@ttn/devices/a840415dd1832b10/up",
    "v3/bkiotlab-lorawapp@ttn/devices/a84041739182dd05/up",
    "v3/bkiotlab-lorawapp@ttn/devices/a84041a54182a79f/up",
    "v3/bkiotlab-lorawapp@ttn/devices/a84041b21182dd3a/up",
]


mongodbClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, setup_connect);

// Retrieve the data through MQTT broker
function setup_connect(err, client) {
    // Test with MongoDB connection
    //console.log("Testing MongoDB connection!");

    db = client.db(db_name);
    collection = db.collection(collection_name);

    mqttclient = mqtt.connect('mqtt://au1.cloud.thethings.network:1883', mqtt_options);
    mqttclient.subscribe(mqtt_topics_list);
    mqttclient.on('connect',mqtt_connect_handler);
    mqttclient.on('error',mqtt_error_handler);
    mqttclient.on('message', mqtt_message_handler);

}
//handle incoming message
function mqtt_message_handler(topic, message, packet)
{
    console.log("Topic: " + topic);
    //console.log("message: " + message)
    console.log("Packet: " + packet, "\n");

    // Parse data
    var data = JSON.parse(message);

    var id = data["end_device_ids"]["device_id"];
    var humidity = data["uplink_message"]["decoded_payload"]["Hum_SHT"];
    var temperature = data["uplink_message"]["decoded_payload"]["TempC_SHT"]
    var time = data["uplink_message"]["received_at"]
    // Console log for validation
    console.log("Time:" + time, "\n",
    "Device ID: " + id, "\n",
    "Humidity: " + humidity, "\n",
    "Temperature: " + temperature, "\n");

    data_model({
      Time: time,
      Device_ID: id,
      Humidity: humidity,
      Temperature: temperature,
    });
    
    routes.post('/devices/:id', (req,res) => {
          if(req.body.formfactor){
              console.log(req.body.formfactor);
          }
          else
          console.log('there is no body');
          var newData = new data_model();
          newData.Time = time;
          newData.Device_ID = id;
          newData.Humidity = humidity;
          newData.Temperature = temperature;
          newData.save((err,savedOBject) => {
          if(err){
              console.log(err);
              res.status(500).send();
            }else{
              console.log('save data successfully');
              res.send(savedOBject);
            }
          })
    })
    routes.put('/update/:id',(req,res) => {
      var id = req.params.id;
      SensorData.findOne({_id: id}, (err,foundObject) => {
          if(err){
              console.log(err);
              res.status(500).send();
          }else {
              if(req.body.time){
                  foundObject.time = req.body.Time;
              }
              else if(req.body.Humidity){
                  foundObject.Humidity = req.body.Humidity;
              }
              else if(req.body.Temperature){
                  foundObject.Temperature = req.body.Temperature;
              }
          }
          foundObject.save( (err,updateObject) => {
              if(err){
                  console.log(err);
                  res.status(500).send();
              } 
          })       
      })
      
      
  });
        
}

// Retrieve the data through MQTT broker
function setup_connect(err, client) {
  // Test with MongoDB connection
  //console.log("Testing MongoDB connection!");

  db = client.db(db_name);
  collection = db.collection(collection_name);

  mqttclient = mqtt.connect('mqtt://au1.cloud.thethings.network:1883', mqtt_options);
  mqttclient.subscribe(mqtt_topics_list);
  mqttclient.on('connect',mqtt_connect_handler);
  mqttclient.on('error',mqtt_error_handler);
  mqttclient.on('message', mqtt_message_handler);

}

//handle incoming connect
function mqtt_connect_handler()
{
    console.log("connected  " + mqttclient.connected)
}

// handle error
function mqtt_error_handler(error)
{
    console.log("Can't connect" + error);
    process.exit(1);
}



app.use(morgan('tiny'));
app.use('/api',routes);

app.listen(PORT,console.log(`Server is starting at ${PORT}`));



