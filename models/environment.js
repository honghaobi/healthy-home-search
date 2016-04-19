var rp = require('request-promise');
var env = require('require-env');

module.exports = {
  getAqi: (userInput) => {
    userInput = userInput.replace(/\s+/g, '+');
    var options = {
      method: 'GET',
      uri:`https://api.breezometer.com/baqi/?location=${userInput}&fields=breezometer_aqi,dominant_pollutant_text,breezometer_description&key=${process.env.BREEZEKEY}`,

      //not permanent fix to CA certificate issue
      rejectUnauthorized: false
    }
  return rp(options)
    .then( (aqiData) => {
      return aqiData;
    })
    .catch( (err) => {
      console.log(err);
    });
  }
}
