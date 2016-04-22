var express = require('express');
var router = express.Router();

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
  }
};
