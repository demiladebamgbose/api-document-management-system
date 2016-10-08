var jwt = require('jsonwebtoken');
var secret = require('./../../config').secret;

var Auth = {};

Auth.generateToken = function (payload) {
  return jwt.sign(payload, secret, {
    expiresIn: 60*60*24
  });
};

module.exports = Auth;
