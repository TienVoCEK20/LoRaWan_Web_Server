var express = require('express');
var router = express.Router();
var userController= require('../controllers/note.controller.js');
router.get('/fetch-data',fetchController.fetchData);
module.exports = router;
