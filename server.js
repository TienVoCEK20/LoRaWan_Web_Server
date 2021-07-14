const express = require('express');
const bodyParser = require('body-parser');
var mongodb  = require('mongodb');
//var config   = require('./config');

var mqtt = require('mqtt');  
var mongodb = require('mongodb');
var mongodbClient = mongodb.MongoClient;
var collection, client;
const PORT = process.env.PORT || 8080;

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
    var hum = data["uplink_message"]["decoded_payload"]["Hum_SHT"];
    var temp = data["uplink_message"]["decoded_payload"]["TempC_SHT"]
    var time = data["uplink_message"]["received_at"]
    
    // Console log for validation
    /*console.log("Time:" + time, "\n",
                "Device ID: " + id, "\n",
                "Humidity: " + hum, "\n",
                "Temperature: " + temp, "\n");
    */
    // MongoDB collection update
    collection.updateOne(
        { _id: id }, 
        { $set: {
            timestamp: time,
            devices_id: id,
            humidity: hum,
            temperature: temp}
        }, 
        { upsert:true },

        function(err,docs) {  
            if(err) {
                console.log("Insert fail")// Improve error handling       
            }
        }
    );
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

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useCreateIndex: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// Require Notes routes
require('./app/routes/note.routes.js')(app);

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
