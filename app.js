var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var passport = require('passport');

require('dotenv').load();

var routes = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');

var app = express();
var knex = require('./db/knex');

function Users() {
  return knex('users');
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session({keys: [process.env.SESSION_KEY1, process.env.SESSION_KEY2]}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
})

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true
},
function(req, accessToken, refreshToken, profile, done) {
  Users().where({google_id: profile.id}).first().then(user => {
    if(user) {
      req.session.user = user;
      return done(null, user);
    } else {
      Users().insert({google_id: profile.id,
      full_name: profile.displayName, email: profile.email}).then(user => {
        req.session.user = user;
        return done(null, user);
      });
    };
  });
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use('/', routes);
app.use('/', users);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
