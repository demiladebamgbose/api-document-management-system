'use strict';

const models = require('./../models/index');
const helper = require('./../../services/helpers');
const userServ = require('./../../services/user_service');

//User controller methods
const User = {

  /**
  * @method signup
  *
  * Creates a new user and saves into the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  signup: (req, res) => {
    models.Users.findOne({
      where: { emailaddress: req.body.emailaddress }
    }).then ((user) => {
      if (!user) {
        userServ.validateDetails(req, res);
      } else {
        helper.sendMessage(res, 409, 'user already exists');
      }
    }).catch ((error) => {
      helper.sendResponse(res, 500, error);
    });
  },

  /**
  * @method login
  *
  * Logs a user in and generates token
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  login: (req, res) => {
    models.Users.findOne({
      where: {emailaddress: req.body.emailaddress}
    }).then ((user) => {
      if(!user){
        helper.sendMessage(res, 401, 'authentication failed. User not found');
      } else {
        userServ.authenticate(req, res, user);
      }
    }).catch ((error) => {
      helper.sendResponse(req, 500, error);
    });
  },

  /**
  * @method allUsers
  *
  * Retrieves all the users from the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  allUsers: (req, res) => {
    models.Users.findAll({})
    .then ((users) => {
      helper.sendResponse(res, 200, users);
    }).catch ((error) => {
      helper.sendResponse(res, 500, error);
    });
  },

  /**
  * @method deleteUser
  *
  * Deletes a user from the database based on params.id
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  deleteUser: (req, res) => {
    userServ.checkAccess(req, res)
    .then((response) => {
      console.log(response)
      if (response) {
        models.Users.destroy({
          where: { id: req.params.id }
        }).then((user) => {
          return helper.sendResponse(res, 200, user);
        }).catch((error) => {
          return helper.sendResponse(res, 500, error);
        });
      } else{
        return helper.sendMessage(res, 403,
         'You do not have access to delete user');
      }
    });
  },

  /**
  * @method findAUser
  *
  * Finds one user based on params.id from the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  findUser: (req, res) => {
    userServ.checkAccess(req, res)
    .then((response) => {
      if (response) {
        models.Users.findOne({
          where: { id: req.params.id }
        }).then((user) => {
          if (user) {
            helper.sendResponse(res, 200, user);
          } else {
            helper.sendMessage(res, 404, 'User does not exit');
          }
        }).catch((error) => {
          helper.sendResponse(res, 500, error);
        });
      } else{
        return helper.sendMessage(res, 403,
         'User details are not yours to view');
      }
    });
  },

  /**
  * @method updateUser
  *
  * Updates all or some of the attributes of the user
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  updateUser: (req, res) => {
    userServ.checkAccess(req, res)
    .then((response) => {
      if (response) {
        models.Users.findOne({
          where: { id: req.params.id }
        }).then((user) => {
          userServ.theUpdater(req, res, user);
        }).catch((error) => {
          helper.sendResponse(res, 500, error);
        });
      } else{
        helper.sendMessage(res, 401,
         'Oops! user details are not yours to edit');
      }
    });
  },

  /**
  * @method logout
  *
  * Logs a user out.
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  logout: (req, res) => {
    helper.sendMessage(res, 200, 'User logged out successfully');
  }
};

module.exports = User;
