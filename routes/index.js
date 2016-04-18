var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/', function(req, res, next) {
  models.getGeoCode(userSearch).then(function(data){
    
    res.render('result', {data});
  })
});


module.exports = router;
