const fetchModel = require('../models/note.model.js');

module.exports={
 
    fetchData:function(req, res){
      
      fetchModel.fetchData(function(data){
          res.render('user-table',{userData:data});
      })
    }
}