var express = require('express');
var router = express.Router();
var search = require('../models/search');
var community = require('../models/community');
var safety = require('../models/safety');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/', function(req, res, next) {
  search.getGeoCode(req.body.userInput).then(function(location){
    //here we are making api calls in promises then rendor the page:
    var allData = {
      renderLocation: location
    }
    community.getSchools(location).then(function(schoolData) {
      if(schoolData.name) {
        return schoolData;
      }
    });
    safety.getCrime(location).then(function(crimeData) {
      console.log(crimeData);
      return crimeData;
    })
    // res.render('result', {allData});
  })
});


module.exports = router;
