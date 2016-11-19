import models from './../models/index';
import helper from './../../services/helpers';
import userService from './../../services/UserService';

/**
* User controller methods
*
* @return {void}
*/
class User {

  /**
  * Creates a new user and saves into the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  signup(req, res) {
    models.Users.findOne({
      where: { emailAddress: req.body.emailAddress }
    }).then((user) => {
      if (!user) {
        userService.validateDetails(req, res);
      } else {
        helper.sendMessage(res, 409, 'user already exists');
      }
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }

  /**
  * Logs a user in and generates token
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  login(req, res) {
    models.Users.findOne({
      where: { emailAddress: req.body.emailAddress }
    }).then((user) => {
      if (!user) {
        helper.sendMessage(res, 404, 'Login failed. User not found');
      } else {
        userService.authenticate(req, res, user);
      }
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }

  /**
  * Retrieves all the users from the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  allUsers(req, res) {
    models.Users.findAll({})
    .then((users) => {
      helper.sendResponse(res, 200, users);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }

  /**
  * Deletes a user from the database based on params.id
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  deleteUser(req, res) {
    userService.checkAccess(req, res)
    .then((response) => {
      if (response) {
        models.Users.destroy({
          where: { id: req.params.id }
        }).then((user) => {
          return helper.sendResponse(res, 200, user);
        }).catch((error) => {
          return helper.sendResponse(res, 500, error);
        });
      } else {
        return helper.sendMessage(res, 403,
         'You do not have access to delete user');
      }
    });
  }

  /**
  * Finds one user based on params.id from the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  findUser(req, res) {
    userService.checkAccess(req, res)
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
      } else {
        return helper.sendMessage(res, 403,
         'User details are not yours to view');
      }
    });
  }

  /**
  * Updates all or some of the attributes of the user
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  updateUser(req, res) {
    userService.checkAccess(req, res)
    .then((response) => {
      if (response) {
        models.Users.findOne({
          where: { id: req.params.id }
        }).then((user) => {
          userService.theUpdater(req, res, user);
        }).catch((error) => {
          helper.sendResponse(res, 500, error);
        });
      } else {
        helper.sendMessage(res, 401,
         'Oops! user details are not yours to edit');
      }
    });
  }

  /**
  * Logs a user out.
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  logout(req, res) {
    helper.sendMessage(res, 200, 'User logged out successfully');
  }
}

export default new User();
