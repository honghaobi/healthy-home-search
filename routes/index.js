var express = require('express');
var router = express.Router();
var search = require('../models/search');
var community = require('../models/community');
var safety = require('../models/safety');
var environment = require('../models/environment');
var accessibility = require('../models/accessibility');
var knex = require('../db/knex');

function Users() {
  return knex('users');
}

function Searches() {
  return knex('searches');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next) {

  req.session.userInput = req.body.userInput;

  search.getGeoCode(req.body.userInput).then(function(location){
    //here we are making api calls in promises then rendor the page:
    var allData = {};
    allData.renderLocation = location;
    var allFunctions = [];

    allFunctions.push(community.getSchools(location).then((schoolData) =>{
      allData.renderSchool = schoolData;
      req.session.schoolNum = allData.renderSchool[0];
    }));

    allFunctions.push(community.getParks(location).then( (parkData) => {
      allData.renderParks = parkData;
      req.session.parksNum = allData.renderParks[0];
    }));

    allFunctions.push(community.getCulturalSpace(location).then( (cultureData) => {
      allData.renderCultCenters = cultureData;
      req.session.cultNum = allData.renderCultCenters[0];
    }));

    allFunctions.push(community.getViewPoints(location).then( (viewpointData) => {
      allData.renderViewpoints = viewpointData;
      req.session.viewNum = allData.renderViewpoints[0];
    }))

    allFunctions.push(community.getRestaurants(location).then( (restaurantData) => {
      allData.renderRestaurants = restaurantData;
    }));

    allFunctions.push(safety.getCrime(location).then(function(finalcrimeData) {
      allData.renderCrime = finalcrimeData;
      req.session.crimeNum = allData.renderCrime[0];
    }));

    allFunctions.push(environment.getAqi(req.body.userInput).then( (aqiData) => {
      allData.renderAqi = aqiData;
      req.session.aqiNum = allData.renderAqi.breezometer_aqi;
    }));

    allFunctions.push(environment.getPermits(location).then( (permitData) => {
      allData.renderPermits = permitData;
      req.session.permitNum = allData.renderPermits[0];
    }));

    allFunctions.push(accessibility.getTransit(location).then( (transitData) => {
      allData.renderTransit = transitData;
      req.session.transitNum = allData.renderTransit[0];
    }));

    allFunctions.push(accessibility.getParking(location).then( (parkingData) => {
      allData.renderParking = parkingData;
    }));

    allFunctions.push(accessibility.getWalkScore(location).then( (walkScoreData) => {
      allData.renderWalkScore = walkScoreData;
    }));

    Promise.all(allFunctions).then(() => {

      //Community Score Calculation:
      req.session.comScore = Math.floor((req.session.schoolNum + req.session.parksNum + req.session.cultNum + req.session.viewNum) / 4);
      res.locals.comScore = req.session.comScore;

      //Environment Score Calculation:
      req.session.enviroScore = Math.ceil((req.session.permitNum + req.session.aqiNum) / 2);
      res.locals.enviroScore = req.session.enviroScore;

      res.locals.user = req.session.user;
      res.render('result', {allData});
    });
  });
});

router.post('/save', function(req, res, next) {
    Searches().insert({user_id:req.session.user.id, address: req.session.userInput, community: req.session.comScore, accessablility: req.session.transitNum, environment: req.session.enviroScore, safety: req.session.crimeNum, date_time: timestamp}).then(function(){
      res.send(200);
    }).catch(function(err){
      console.log(err);
    })
});

router.get('/user/:id', function(req, res, next) {
  Users().select().where({id:req.params.id}).then(function(user){
    Searches().select().where({user_id:req.params.id}).then(function(searches){
      res.render('user', {user, searches});
    });
  });
});

router.get('/user/:user_id/delete/:search_id', function(req, res, next) {
  Searches().del().where({id:req.params.search_id}).then(function(){
    res.redirect('../../../user/' + req.params.user_id);
  })
});

module.exports = router;
