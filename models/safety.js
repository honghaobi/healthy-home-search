var rp = require('request-promise');
var env = require('require-env');

module.exports = {
  getCrime: (location) => {
    var today = new Date();
    var thisYear = today.getFullYear();
    var thisMonth = today.getMonth();
    var subMonth = (thisMonth - 2);

    if(subMonth < 1) {
      var lastYear = (thisYear - 1);
      var newMonth = 12 + subMonth;

      var searchDate = `AND year>= ${lastYear} AND month>= ${newMonth}`;
    } else {
      var searchDate = `AND year>= ${thisYear} AND month>= ${subMonth}`;
    }

    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/y7pv-r3kh.json?$where=within_circle(location,${location.long},${location.lat},1500) ${searchDate}`,
      qs: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }

    return rp(options)
      .then(function(crimeData) {
        return crimeData;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
