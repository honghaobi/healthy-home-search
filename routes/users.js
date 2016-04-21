var express = require('express');
var router = express.Router();
var users = require('../models/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('register');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register/signup', function(req, res, next) {
  users.createUser(req.body, (err, data) => {
    res.redirect('/');
  });
});

router.post('/register/signin', (req, res, next) => {
  users.authenticateUser(req.body.full_name, req.body.password, (err, user) => {
    if (err) {
      res.render('register', {error: err});
    } else {
      console.log('res locals', res.locals);
      req.session.user = user;
      res.redirect('/');
    }
  });
});

router.get('/signout', (req, res, next) => {
  req.session = null;
  res.redirect('/');
});

module.exports = router;
