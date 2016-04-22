var express = require('express');
var router = express.Router();
var knex = require('../db/knex');


function Users() {
  return knex('users');
}

module.exports = {

  nameIsNotBlank: function(input) {
    return !input.trim() ? 'Name cannot be blank' : '';
  },

  emailIsValid: function(input) {
    if (input.trim() ===
    '') {
      return 'Email is invalid';
    }

    if
    (input === '@') {
      return 'Email is invalid';
    }

    if (input.split('@').length !== 2) {
      return 'Email is invalid';
    }
  },
  isUserRegistered: function(userEmail){
    return Users().where({email:userEmail}).first().then(function(user){
      console.log(user);
      if(user){
        console.log('User exists');
        return 'User exists';
      }
    })
  }
};
