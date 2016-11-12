
'use strict';

const models = require('./../models/index');
const helper = require('./../../services/helpers');
const roleServ = require('./../../services/role_service');


// Controller methods for Roles Resource
const Role = {

  /**
  * @method createRole
  *
  * Creates a new role ans saves it to the database.
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  createRole: (req, res) => {
    if (helper.validateRequestBody(req.body)) {
      // Saves role in the database
      roleServ.addRole(req, res);
    } else {
      helper.sendMessage(res, 400, 'Title field cannot be empty');
    }
  },

  /**
  * @method all
  *
  * Retrieves all roles from the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  all: (req, res) => {
    models.Roles.findAll({})
    .then ((roles) => {
      helper.sendResponse(res, 200, roles);
    }).catch ((error) => {
      helper.sendResponse(res, 500, error);
    });
  },

  /**
  * @method updateRole
  *
  * Updates all or some of the attributes of a Role
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  updateRole: (req, res) => {
    // Finds one role based on the params.id
    models.Roles.find({
      where: { id: req.params.id }
    }).then((role) => {
      if (role) {
        //Updates all or some of the attributes of the Role
        roleServ.updateRole(req, res, role);
      } else {
        helper.sendMessage(res, 400,
         'Unable to udate role. Role does not exist');
      }
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  },

  /**
  * @method findRole
  *
  * Finds a unique role in the database based on params.id
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  findRole: (req, res) => {
    models.Roles.findOne({
      where: { id: req.params.id }
    }).then((role) => {
      if (role) {
        helper.sendResponse(res, 200, role);
      } else {
        helper.sendMessage(res, 400, 'Role does not exist');
      }
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  },

  /**
  * @method deleteRole
  *
  * Deletes a  Role from the database based on params.id
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  deleteRole: (req, res) => {
    models.Roles.destroy({
      where: {
        id: req.params.id
      }
    }).then((role) => {
      helper.sendResponse(res, 200, role);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }
};

module.exports = Role;
