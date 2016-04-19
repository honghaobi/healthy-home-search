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
  }
}
