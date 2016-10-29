(function () {
  'use strict';

  var bcrypt = require('bcrypt-nodejs');
  var models = require('./../models/index');


  var Helper = {

    /**
    * @method validateInput
    *
    * Ensures a string input is not empty
    *
    * @param {String} input
    * @return {Boolean} true or false
    */
    validateInput: function (input) {
      if (input) {
        return true;
      }
      return false;
    },

    /**
    * @method validateRequestBody
    *
    * Ensures the request body does not contain any null feild
    *
    * @param {Object} body
    * @return {Boolean} true or false
    */
    validateRequestBody: function (body) {
      var keys = Object.keys(body);
      for (var i = 0; i < keys.length; i++) {
        if (!Helper.validateInput(body[keys[i]])) {
          return false;
        }
      }
      return true;
    },

    /**
    * @method validatePassWord
    *
    * Ensures password is at least  8 characters
    *
    * @param {String} password
    * @return {Boolean} true or false
    */
    validatePassWord: function (password) {
      return /^[\w]{8,}$/.test(password);
    },

    /**
    * @method validateEmail
    *
    * Ensures string is a valid email address
    *
    * @param {String} email
    * @return {Boolean} true or false
    */
    validateEmail: function (email) {
      return /(.*@.*\..*)/.test(email);
    },

    /**
    * @method checkRole
    *
    * Ensures roleId is a reference to an existing role
    *
    * @param {Integer} roleId
    * @return {Promise}
    * @return {Boolean} true or false
    */
    checkRole: function (roleId) {
      return models.Roles.findOne({
        where:
        {id: roleId}
      }).then(function (role) {
        if (role) {
          return true;
        }
        return false;
      });
    },

    /**
    * @method checkUser
    *
    * Ensures ownerId is a reference to an existing user
    *
    * @param {Integer} ownerId
    * @return {Promise}
    * @return {Boolean} true or false
    */
    checkUser: function (ownerId) {
      return models.Users.findOne({
        where:
        {id: ownerId}
      }).then(function (user) {
        if (user) {
          return true;
        }
        return false;
      });
    },

    /**
    * @method comparePasswords
    *
    * Uses bcrypt to compare passwords
    *
    * @param {String} string
    * @param {String} hashed Hased password
    * @return {Boolean} true or false
    */
    comparePasswords: function (string, hashed) {
      var result = bcrypt.compareSync(string, hashed); // true
      return result;
    },

    /**
    * @method hashPassword
    *
    * Uses bcrypt to hash password
    *
    * @param {String} password
    * @return {String} Hashed password
    */
    hashPassword: function (password) {
      return bcrypt.hashSync(password);
    }
  };

  module.exports = Helper;
  
})();
