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
      return JSON.parse(aqiData);
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
      .then( (permitData) => {
        var totPermit = Object.keys(permitData).length
        var permitAvg = 232.62;
        var stD = 139.59;
        var zScore = ( -(totPermit - permitAvg) / stD)

        var permitGrade = Math.floor(((zScore + 2) / 4) * 100);

        if (permitGrade > 100) {
          return [99, permitData];
        } else if (permitGrade < 5) {
          return [5, permitData];
        } else {
          return [permitGrade, permitData];
        }
      })
      .catch( (err) => {
        console.log(err);
      });
  }
}
