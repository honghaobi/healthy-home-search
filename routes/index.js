var express = require('express');
var router = express.Router();
var search = require('../models/search');
var community = require('../models/community');
var safety = require('../models/safety');
var environment = require('../models/environment');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/', function(req, res, next) {
  search.getGeoCode(req.body.userInput).then(function(location){
    //here we are making api calls in promises then rendor the page:
    var allData = {};
    allData.renderLocation = location;
    var allFunctions = [];

    allFunctions.push(community.getSchools(location).then(function(schoolData) {
      allData.renderSchool = schoolData;
    }));

    allFunctions.push(safety.getCrime(location).then(function(crimeData) {
      allData.renderCrime = crimeData;
    }));


    allFunctions.push(environment.getAqi(req.body.userInput).then( (aqiData) => {
      allData.renderAqi = aqiData;
    }));

    Promise.all(allFunctions).then(function(){
      res.render('result', {allData});
    });
  });
});


module.exports = router;
