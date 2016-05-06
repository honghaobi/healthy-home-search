var rp = require('request-promise');
var env = require('require-env');

module.exports = {
  getSchools: (location) => {
    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/ywms-iep2.json?$where=within_circle(shape,${location.long},${location.lat},1500)`,
      qs: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }

    return rp(options)
      .then(function(schoolData) {
        return schoolData;
      })
      .then( (schoolData) => {
        var totSchools = Object.keys(schoolData).length
        var schoolAvg = 4.8;
        var stD = 2.38;
        var zScore = ((totSchools - schoolAvg) / stD)

        var schoolGrade = Math.floor((((zScore) + 2) / 4) * 100);

        if (schoolGrade > 100) {
          return [99, schoolData];
        } else if (schoolGrade < 5) {
          return [5, schoolData];
        } else {
          return [schoolGrade, schoolData];
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  getParks: (location) => {
    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/3c4b-gdxv.json?$where=within_circle(location,${location.long},${location.lat},1500)&city_feature=Parks`,
      qs: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }

    return rp(options)
      .then( (parkData) => {
        return parkData;
      })
      .then( (parkData) => {
        var totParks = Object.keys(parkData).length
        var parkAvg = 11.9;
        var stD = 7.22;
        var zScore = ((totParks - parkAvg) / stD)

        var parkGrade = Math.floor((((zScore) + 2) / 4) * 100);

        if (parkGrade > 100) {
          return [99, parkData];
        } else if (parkGrade < 5) {
          return [5, parkData];
        } else {
          return [parkGrade, parkData];
        }
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  getCulturalSpace: (location) => {
    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/bsta-72tn.json?$select=name,location&$where=within_circle(location,${location.long},${location.lat},1500)&closed=0`,
      qs: {
        $$app_token: process.env.SODAKEY,
      },
      json:true
    }

    return rp(options)
      .then( (cultureData) => {
        return cultureData;
      })
      .then( (cultureData) => {
        var totCulture = Object.keys(cultureData).length
        var cultAvg = 36.3;
        var stD = 54.1;
        var zScore = ((totCulture - cultAvg) / stD)

        var cultureGrade = Math.floor((((zScore) + 2) / 4) * 100);

        if (cultureGrade > 100) {
          return [99, cultureData];
        } else if (cultureGrade < 5) {
          return [5, cultureData];
        } else {
          return [cultureGrade, cultureData];
        }
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  getViewPoints: (location) => {
    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/3c4b-gdxv.json?$where=within_circle(location,${location.long},${location.lat},1500)&city_feature=Viewpoints`,
      qs: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }

    return rp(options)
      .then( (viewpointData) => {
        return viewpointData;
      })
      .then( (viewpointData) => {
        var totViews = Object.keys(viewpointData).length
        var viewAvg = 2.78;
        var stD = 2.17;
        var zScore = ((totViews - viewAvg) / stD)

        var viewGrade = Math.floor((((zScore) + 2) / 4) * 100);

        if (viewGrade > 100) {
          return [99, viewpointData];
        } else if (viewGrade < 5) {
          return [5, viewpointData];
        } else {
          return [viewGrade, viewpointData];
        }
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  getRestaurants: (location) => {
    var options = {
      method: 'GET',
      uri: `https://developers.zomato.com/api/v2.1/geocode`,
      qs: {
        lat: location.long,
        lon: location.lat
      },
      headers: {
        'Accept': 'application/json',
        'user-key': process.env.ZOMATOKEY
      },
      json:true
    }
    return rp(options)
      .then( (restaurantData) => {
        return restaurantData;
      })
      .catch( (err) => {
        console.log('zomato error', err);
      });
  }
}
