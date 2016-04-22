var express = require('express');
var router = express.Router();
var users = require('../models/users');
var validations = require('../models/validations');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('register');
});

router.get('/register', function(req, res, next) {
  res.render('register', {errors: [], validInputs: {}});
});

router.post('/register/signup', function(req, res, next) {
  var errors = [];
  var validInputs = {};

  if (validations.nameIsNotBlank(req.body.full_name)) {
    errors.push(validations.nameIsNotBlank(req.body.full_name));
  } else {
    validInputs.full_name = req.body.full_name;
  }

  if (validations.emailIsValid(req.body.email)) {
    errors.push(validations.emailIsValid(req.body.email));
  } else {
    validInputs.email = req.body.email;
  }

  validations.isUserRegistered(req.body.email).then(function(error){
    if (error) {
      errors.push(error)
    }
    var dataForView = {
      errors: errors,
      validInputs: validInputs
    };
    if (errors.length) {
      res.render('register', dataForView);
    }

    users.createUser(req.body, (err, data) => {
      res.redirect('/');
    });

  });
});

router.post('/register/signin', (req, res, next) => {
  users.authenticateUser(req.body.full_name, req.body.password, (err, user) => {
    var validInputs = {};
    if (err) {
      res.render('register', {error: err, validInputs});
    } else {
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
