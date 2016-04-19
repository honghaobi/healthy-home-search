var express = require('express');
var router = express.Router();
var search = require('../models/search');
var community = require('../models/community');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/', function(req, res, next) {
  search.getGeoCode(req.body.userInput).then(function(location){
    //here we are making api calls in promises then rendor the page:
    var allData = {};
    allData.renderLocation = location;

    community.getSchools(location).then(function(schoolData) {
      allData.renderSchool = schoolData;
      console.log(schoolData);
      res.render('result', {allData});
    })
  })
});


module.exports = router;
