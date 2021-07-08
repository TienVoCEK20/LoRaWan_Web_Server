var mqtt = require('mqtt');  
var mongodb = require('mongodb');
var mongodbClient = mongodb.MongoClient;
var collection, client;

const db_name = "lora_wan";
const collection_name = "sensor_data";
const uri = "mongodb+srv://Lora_WAN:bkiotlab@2021@cluster0.3qbjg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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
    console.log("Time:" + time, "\n",
                "Device ID: " + id, "\n",
                "Humidity: " + hum, "\n",
                "Temperature: " + temp, "\n");

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
