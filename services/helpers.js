(() => {
  'use strict';

  const bcrypt = require('bcrypt-nodejs');
  const models = require('./../server/models/index');


  const Helper = {

    /**
    * @method validateInput
    *
    * Ensures a string input is not empty
    *
    * @param {String} input
    * @return {Boolean} true or false
    */
    validateInput: (input) => {
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
    validateRequestBody: (body) => {
      const keys = Object.keys(body);
      for (let i = 0; i < keys.length; i++) {
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
    validatePassWord: (password) => {
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
    validateEmail: (email) => {
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
    checkRole: (roleId) => {
      return models.Roles.findOne({
        where:
        {id: roleId}
      }).then((role) =>{
        if (role) {
          return true;
        }
        return false;
      });
    },

    /**
    * @method isvalidName
    *
    * Ensures name contains only characters a-z
    *
    * @param {String} name
    * @return {Boolean} true or false
    */
    isvalidName: (name) => {
      return /^[a-z]*$/i.test(name);
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
    comparePasswords: (string, hashed) => {
      const result = bcrypt.compareSync(string, hashed);
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
    hashPassword: (password) => {
      return bcrypt.hashSync(password);
    },

    /**
    * @method sendResponse
    *
    * Sends response to requests
    *
    * @param {Object} res An instance of response
    * @param {Integer} status Http status code
    * @param {error} error Possible error
    * @param {Boolean} success true or false
    * @param {Object} status Http status code

    */
    sendMessage: (res, status, message) => {
      res.status(status).json({
        success: false,
        message: message
      });
    },


    /**
    * @method sendResponse
    *
    * Sends response to requests
    *
    * @param {Object} res An instance of response
    * @param {Integer} status Http status code of response
    * @param {Object} obj object response

    */
    sendResponse: (res, status, obj) => {
      res.status(status).json(obj);
    },

    /**
    * @method sendUser
    *
    * Sends user and token as response to requests
    *
    * @param {Object} res An instance of response
    * @param {String} token Jwt token generated
    * @param {Object} user user object as response
    */
    sendUser: (res, token, user) => {
      res.status(200).json({
        token: token,
        success: true,
        user: user
      });
    }
  };

  module.exports = Helper;

})();
