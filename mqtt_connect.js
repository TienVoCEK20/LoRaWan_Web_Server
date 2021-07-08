const mqtt = require('mqtt');

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

mqttclient = mqtt.connect("mqtt://au1.cloud.thethings.network", mqtt_options)
mqttclient.subscribe(mqtt_topics_list)

//handle incoming connect
function mqtt_connect_handler()
{
    console.log("connected  " + mqttclient.connected)
}

mqttclient.on('connect', mqtt_connect_handler);

//handle incoming message
function mqtt_message_handler(topic, message, packet)
{
    console.log("topic: " + topic)
    console.log("message: " + message)
    console.log("packet: " + packet)

    //ADD TO DATABASE
    //DO HERE
}

mqttclient.on('message', mqtt_message_handler);

//handle error
function mqtt_error_handler(error)
{
    console.log("Can't connect" + error);
    process.exit(1);
}

mqttclient.on('error', mqtt_error_handler);