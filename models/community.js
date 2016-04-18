var rp = require('request-promise');
var env = require('require-env');

module.exports = {
  getSchools: (location) => {
    var options = {
      method: 'GET',
      uri: 'https://data.seattle.gov/resource/ywms-iep2.json?$where=within_circle(shape,' + location.long + ',' + location.lat + ',1500)',
      qs: {
        $$app_token: process.env.SODAKEY,
      },
      json:true
    }

    return rp(options)
      .then(function(schoolData) {
        return schoolData;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
