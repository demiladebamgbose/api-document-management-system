(() => {
  'use strict';

  const helper = require('./helpers');
  const models = require('./../server/models/index');
  const auth = require('./../server/controllers/auth');

  const UserService = {

    /**
    * @method validateDetails
    *
    * Ensures input fields are not empty before creating a user
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    validateDetails: (req, res) => {
      helper.checkRole(req.body.RoleId).then((role) => {
        if (!role) {
          return helper.sendMessage(res, 422, 'Invalid Role for user');
        }

        if (!helper.validateRequestBody(req.body)) {
          return helper.sendMessage(res, 422,
           'Missing fields. Feilds cannot be empty');
        }

        UserService.validateInput(req, res);
      });
    },

    /**
    * @method validateInput
    *
    * Ensures input fields are properly formatted
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    validateInput: (req, res) => {
      if (!(helper.isvalidName(req.body.lastname)) &&
       (helper.isvalidName(req.body.lastname))) {
        return helper.sendMessage(res, 422, 'Invalid First name or Last name');
      }

      if ( (helper.validateEmail(req.body.emailaddress)) &&
      (helper.validatePassWord(req.body.password))) {
        UserService.createUser(req, res);
      } else {
        return helper.sendMessage(res, 422, 'Invalid Email Address or Password');
      }
    },

    /**
    * @method createUser
    *
    * Creates a new user and new user and saves it to the database on signup
    *
    * @param {Object} req An instance of request
    * @return {Void}
    */
    createUser: (req, res) => {
      models.Users.create({
        emailaddress: req.body.emailaddress,
        password: helper.hashPassword(req.body.password),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        RoleId: req.body.RoleId
      }).then ((user) => {
        const token = auth.generateToken({
          emailaddress: user.emailaddress,
          password: user.password,
          RoleId: user.RoleId,
          OwnerId: user.id
        });
        helper.sendUser(res, token, user);
      }).catch ((error) => {
        helper.sendResponse(res, 500, error);
      });
    },

    /**
    * @method authenticate
    *
    * Conpares password on login.
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @param {Object} user
    * @return {Void}
    */
    authenticate: (req, res, user) => {
      const response = helper.comparePasswords(req.body.password, user.password);
      if (response) {
        const token = auth.generateToken({
          emailaddress: user.emailaddress,
          password: user.password,
          RoleId: user.RoleId,
          OwnerId: user.id
        });
        helper.sendUser(res, token, user);
      } else{
        helper.sendMessage(res, 403, 'authentication failed. Wrong password');
      }
    },

    /**
    * @method checkAccess
    *
    * Checks if a user has access to update user details
    *
    * @param {Object} req An instance of request
    * @return {Void}
    */
    checkAccess: (req) => {
      //eslint-disable-next-line
      if (req.decoded.OwnerId == req.params.id) {
        return true;
      }
      return false;
    },

    /**
    * @method theUpdater
    *
    * Updates all or some of the attributes of the document
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @param {Object} user user to be upated
    * @return {Void}
    */
    theUpdater: (req, res, user) => {
      user.updateAttributes({
        emailaddress: req.body.emailaddress,
        password: helper.hashPassword(req.body.password),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        RoleId: req.body.RoleId
      }, { fields: Object.keys(req.body) }).then((user) => {
        const token = auth.generateToken({
          emailaddress: user.emailaddress,
          password: user.password,
          RoleId: user.RoleId,
          OwnerId: user.id
        });
        helper.sendUser(res, token, user);
      }). catch((error) => {
        res.sendResponse(res, 500, error);
      });
    }
  };

  module.exports = UserService;

})();
