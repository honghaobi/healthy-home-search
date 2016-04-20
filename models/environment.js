var rp = require('request-promise');
var env = require('require-env');

module.exports = {
  getAqi: (userInput) => {
    console.log(userInput);
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
  },

  getPermits: (location) => {
    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/mags-97de.json?$where=within_circle(location, ${location.long}, ${location.lat},500)`,
      qs: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }

    return rp(options)
      .then( (permitData) => {
        return permitData;
      })
      .catch( (err) => {
        console.log(err);
      });
  }
}
