var rp = require('request-promise');
var env = require('require-env');

module.exports = {
  getTransit: (location) => {
    var options = {
      method: 'GET',
      uri: `http://api.pugetsound.onebusaway.org/api/where/stops-for-location.json?key=${process.env.ONEBUSAWAY}&lat=${location.long}&lon=${location.lat}&radius=500`,
      json:true
    }


    return rp(options)
      .then(function(transitData) {
        return transitData;
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  getParking: (location) => {
    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/3neb-8edu.json?$where=within_circle(shape,${location.long},${location.lat},1500)`,
      ps: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }


    return rp(options)
      .then(function(parkingData) {
        return parkingData;
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  getWalkScore: (location) => {
    var options = {
      method: 'GET',
      uri: `http://api.walkscore.com/score?format=json&lat=${location.long}&lon=${location.lat}&wsapikey=${process.env.WALKSCORE}`,
      json:true
    }


    return rp(options)
      .then(function(parkingData) {
        return parkingData;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
