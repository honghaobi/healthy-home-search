var rp = require('request-promise');
var env = require('require-env');

module.exports = {
  getAqi: (userInput) => {
    var options = {
      method: GET,
      uri: 'https://api.breezometer.com/baqi/?fields=breezometer_aqi,dominant_pollutant_text,breezometer_description'
      qs: {
        location: userInput,
        key: process.env.BREEZEKEY
      }
    }
    return rp(options).then( (data) = {

    });
  }

}
