const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
            Time: String,
            Device_ID: String,
            Humidity: Number,
            Temperature: Number,
            timestamp: String
        });
var userTable=mongoose.model('data_sensor',userSchema);
        
/*module.exports={
     fetchData:function(callback){
        var userData=userTable.find({});
        userData.exec(function(err, data){
            if(err) throw err;
            return callback(data);
        })        
     }
}*/
module.exports = userTable; 

