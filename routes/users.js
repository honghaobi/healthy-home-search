var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/signin');
});

router.get('/new', function(req, res, next) {
  res.render('users/new');
});

router.post('/', function(req, res, next) {
  Users.createUser(req.body, (err, data) => {
    res.send(data);
  });
});

module.exports = router;
