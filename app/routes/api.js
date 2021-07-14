const express = require('express');

const router = express.Router();

const SensorData = require('../models/data.model')

router.get('/sensor_data',(req,res) => {
    SensorData.find({ })
        .then((data) => {
            console.log('Data: ',data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', daerrorta);
        });
})

router.post('/save_data',(req,res) => {
    console.log('Body',req.body);
    const data = req.body;
    const newData = new SensorData (data);
    //save
    newData.save((err) => {
        if (error){
            res.status().json({msg: 'internal server errors'});
        }else{
            res.json({
                msg: 'your data has been saved'
            })
        }
    })
    res.json({
        msg: 'we received your data!!!'
    });
});

router.get('/sensor_data/1',(req,res) => {
    const data = {
        device: '1',
        id: '2'
    };
    res.json(data);
})

module.exports = router;
