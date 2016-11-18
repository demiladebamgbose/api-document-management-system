'use strict';

const helper = require('./helpers');
const models = require('./../server/models/index');
const auth = require('./../server/controllers/auth');

const UserService = {

  /**
  * Ensures input fields are not empty before creating a user
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  validateDetails: (req, res) => {
    if (!helper.validateRequestBody(req.body)) {
      return helper.sendMessage(res, 400,
       'Missing fields. Fields cannot be empty');
    }

    UserService.validateInput(req, res);
  },

  /**
  * Ensures input fields are properly formatted
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  validateInput: (req, res) => {
    if ((!helper.isvalidName(req.body.lastname)) ||
     (!helper.isvalidName(req.body.lastname))) {
      return helper.sendMessage(res, 400, 'Invalid First name or Last name');
    }

    if ((helper.validateEmail(req.body.emailaddress)) &&
    (helper.validatePassWord(req.body.password))) {
      UserService.getGuestRoleId(req, res);
    } else {
      return helper.sendMessage(res, 400, 'Invalid Email Address or Password');
    }
  },

  getGuestRoleId: (req, res) => {
    models.Roles.findOne({
      where: { title: 'Guest' }
    }).then((role) => {
      UserService.createUser(req, res, role.id);
    });
  },

  /**
  * Creates a new user and new user and saves it to the database on signup
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @param {Object} roleId
  * @return {void}
  */
  createUser: (req, res, roleId) => {
    models.Users.create({
      emailaddress: req.body.emailaddress,
      password: helper.hashPassword(req.body.password),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      RoleId: roleId
    }).then((user) => {
      const token = auth.generateToken({
        emailaddress: user.emailaddress,
        password: user.password,
        RoleId: user.RoleId,
        OwnerId: user.id
      });
      helper.sendUser(res, 201, token, user);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  },

  /**
  * Conpares password on login.
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @param {Object} user
  * @return {void}
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
      helper.sendUser(res, 200, token, user);
    } else {
      helper.sendMessage(res, 401, 'authentication failed. Wrong password');
    }
  },

  /**
  * Checks if a user has access to update user details
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  checkAccess: (req, res) => {
    return models.Roles.findOne({
      where: { id: req.decoded.RoleId }
    }).then((role) => {
      if ((role.title === 'Admin') ||
       (req.decoded.OwnerId === parseInt(req.params.id, 10))) {
        return true;
      }
      return false;
    }).catch((error) => {
      return helper.sendResponse(res, 500, error);
    });
  },

  /**
  * Updates all or some of the attributes of the document
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @param {Object} user user to be upated
  * @return {void}
  */
  theUpdater: (req, res, user) => {
    user.updateAttributes({
      emailaddress: req.body.emailaddress,
      password: helper.hashPassword(req.body.password),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
    }, { fields: Object.keys(req.body) }).then((users) => {
      const token = auth.generateToken({
        emailaddress: user.emailaddress,
        password: user.password,
        RoleId: user.RoleId,
        OwnerId: user.id
      });
      helper.sendUser(res, 201, token, users);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }
};

module.exports = UserService;
