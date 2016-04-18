var rp = require('request-promise');
var env = require('require-env');

module.exports = {
  getSchools: (location) => {
    var options = {
      method: 'GET',
      uri: 'https://data.kingcounty.gov/resource/cnyx-gwan.json?$where=within_circle(location_geo,' + location.long + ',' + location.lat + ',5000)',
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
