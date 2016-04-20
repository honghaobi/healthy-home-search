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

router.post('/signin', (req, res, next) => {
  Users.authenticateUser(req.body.email, req.body.password, (err, user) => {
    if (err) {
      res.render('users/signin', {error: err});
    } else {
      req.session.user = user;
      res.redirect('/');
    }
  });
});

module.exports = router;
