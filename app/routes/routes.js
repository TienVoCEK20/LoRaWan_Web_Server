const express = require('express');

const router = express.Router();

const SensorData = require('../models/data.model')

router.get('/',(req,res) => {
    SensorData.find({  })
    .then((data) => {
        console.log('Data: ', data);
        res.json(data);
    })
    .catch((error) => {
        console.log('error: ', error);
    });
})

router.get('/devices/:id',(req,res) => {
    var id = req.params.id;
    SensorData.findOne({_id: id }, (err) =>{
        if(err) console.log(err);
    }) 
    .then((data) => {
        console.log('Data: ', data);
        res.json(data);
    })
    .catch((error) => {
        console.log('error: ', error);
    });
})

router.put('/update/:id',(req,res) => {
    var id = req.params.id;
    SensorData.findOne({_id: id}, (err,foundObject) => {
        if(err){
            console.log(err);
            res.status(500).send();
        }else {
            if(req.body.Time){
                foundObject.Time = req.body.Time;
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

router.post('/save', (req, res) => {
    const data = req.body;

    const newSensorData = new SensorData(data);

    newSensorData.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        // BlogPost
        return res.json({
            msg: 'Your data has been saved!!!!!!'
        });
    });
});

module.exports = router;
