var Helper = {};
var bcrypt = require('bcrypt-nodejs');
var models = require('./../models/index');

Helper.validateInput = function (input) {
  if (input) {
    return true;
  }
  return false;
};

Helper.validatePassWord = function (password) {
  return /^[\w]{8,}$/.test(password);
};

Helper.validateEmail = function (email) {
  return /(.*@.*\..*)/.test(email);
};

Helper.checkRole = function (roleId) {
  return models.Role.findOne({
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
  return models.User.findOne({
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
