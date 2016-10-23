var Helper = {};
var bcrypt = require('bcrypt-nodejs');
var models = require('./../models/index');

Helper.validateInput = function (input) {
  if (input) {
    return true;
  }
  return false;
};

Helper.validateRequestBody = function (body) {
  var keys = Object.keys(body);
  for (var i = 0; i < keys.length; i++) {
    if (!Helper.validateInput(body[keys[i]])) {
      return false;
    }
  }
  return true;
};

Helper.validatePassWord = function (password) {
  return /^[\w]{8,}$/.test(password);
};

Helper.validateEmail = function (email) {
  return /(.*@.*\..*)/.test(email);
};

Helper.checkRole = function (roleId) {
  return models.Roles.findOne({
    where:
    {id: roleId}
  }).then(function (role) {
    if (role) {
      return true;
    }
    return false;
  });
};

Helper.checkUser = function (ownerId) {
  return models.Users.findOne({
    where:
    {id: ownerId}
  }).then(function (user) {
    if (user) {
      return true;
    }
    return false;
  });
};

Helper.comparePasswords = function (string, hashed) {
  var result = bcrypt.compareSync(string, hashed); // true
  return result;
};

Helper.hashPassword = function (password) {
  return bcrypt.hashSync(password);
};

module.exports = Helper;
