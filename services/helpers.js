'use strict';

const bcrypt = require('bcrypt-nodejs');
const models = require('./../server/models/index');


const Helper = {

  /**
  * Ensures only admin can create roles
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @param {Object} next
  * @return {void}
  */
  checkAdminAccess: (req, res, next) => {
    models.Roles.findOne({
      where: { id: req.decoded.RoleId }
    }).then((role) => {
      if (role.title === 'Admin') {
        next();
      } else {
        return Helper.sendMessage(res, 403, 'Admin role needed to access resource');
      }
    });
  },

  /**
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
  * Ensures the request body does not contain any null field
  *
  * @param {Object} body
  * @return {Boolean} true or false
  */
  validateRequestBody: (body) => {
    const keys = Object.keys(body);
    for (let i = 0; i < keys.length; i += 1) {
      if (!Helper.validateInput(body[keys[i]])) {
        return false;
      }
    }
    return true;
  },

  /**
  * Ensures password is at least  8 characters
  *
  * @param {String} password
  * @return {Boolean} true or false
  */
  validatePassWord: (password) => {
    return /^[\w]{8,}$/.test(password);
  },

  /**
  * Ensures string is a valid email address
  *
  * @param {String} email
  * @return {Boolean} true or false
  */
  validateEmail: (email) => {
    return /(.*@.*\..*)/.test(email);
  },

  /**
  * Ensures roleId is a reference to an existing role
  *
  * @param {Integer} roleId
  * @return {Promise} checkRole
  * @return {Boolean} true or false
  */
  checkRole: (roleId) => {
    return models.Roles.findOne({
      where:
      { id: roleId }
    }).then((role) => {
      if (role) {
        return true;
      }
      return false;
    });
  },

  /**
  * Ensures name contains only characters a-z
  *
  * @param {String} name
  * @return {Boolean} true or false
  */
  isvalidName: (name) => {
    return /^[a-z]*$/i.test(name);
  },

  /**
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
  * Uses bcrypt to hash password
  *
  * @param {String} password
  * @return {String} Hashed password
  */
  hashPassword: (password) => {
    return bcrypt.hashSync(password);
  },

  /**
  * Sends response to requests
  *
  * @param {Object} res An instance of response
  * @param {Integer} status Http status code
  * @param {error} messages
  * @param {Boolean} success true or false
  * @returns {void}
  */
  sendMessage: (res, status, messages) => {
    res.status(status).json({
      success: false,
      message: messages
    });
  },


  /**
  * Sends response to requests
  *
  * @param {Object} res An instance of response
  * @param {Integer} status Http status code of response
  * @param {Object} obj object response
  * @return {void}
  */
  sendResponse: (res, status, obj) => {
    res.status(status).json(obj);
  },

  /**
  * Sends user and token as response to requests
  *
  * @param {Object} res An instance of response
  * @param {String} status Status code
  * @param {String} token Jwt token generated
  * @param {Object} user user object as response
  * @return {void}
  */
  sendUser: (res, status, token, user) => {
    res.status(status).json({
      token: token,
      success: true,
      user: user
    });
  }
};

module.exports = Helper;
