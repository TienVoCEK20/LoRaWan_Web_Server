const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
            _id: String,
            Time: String,
            Device_ID: String,
            Humidity: Number,
            Temperature: Number,
        });
var userTable=mongoose.model('data_sensor',userSchema);
        
module.exports = userTable; 

