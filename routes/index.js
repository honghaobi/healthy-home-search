var express = require('express');
var router = express.Router();
var search = require('../models/search');
var community = require('../models/community');
var safety = require('../models/safety');
var environment = require('../models/environment');
var accessibility = require('../models/accessibility');

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

    allFunctions.push(community.getParks(location).then( (parkData) => {
      allData.renderParks = parkData;
    }));

    allFunctions.push(community.getCulturalSpace(location).then( (cultureData) => {
      allData.renderCultCenters = cultureData;
    }));

    allFunctions.push(community.getViewPoints(location).then( (viewpointData) => {
      allData.renderViewpoints = viewpointData;
    }))

    allFunctions.push(community.getRestaurants(location).then( (restaurantData) => {
      console.log(restaurantData);
      allData.renderRestaurants = restaurantData;
    }));

    allFunctions.push(safety.getCrime(location).then(function(crimeData) {
      allData.renderCrime = crimeData;
    }));

    allFunctions.push(environment.getAqi(req.body.userInput).then( (aqiData) => {
      allData.renderAqi = aqiData;
    }));

    allFunctions.push(environment.getPermits(location).then( (permitData) => {
      allData.renderPermits = permitData;
    }));

    allFunctions.push(accessibility.getTransit(location).then( (transitData) => {
      allData.renderTransit = transitData;
    }));

    allFunctions.push(accessibility.getParking(location).then( (parkingData) => {
      allData.renderParking = parkingData;
    }));

    allFunctions.push(accessibility.getWalkScore(location).then( (walkScoreData) => {
      console.log(walkScoreData);
      allData.renderWalkScore = walkScoreData;
    }));

    Promise.all(allFunctions).then(function(){
      res.render('result', {allData});
    });
  });
});


module.exports = router;
