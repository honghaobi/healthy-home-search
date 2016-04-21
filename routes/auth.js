var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/google', passport.authenticate('google', {
  scope: ['email']
}));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;
