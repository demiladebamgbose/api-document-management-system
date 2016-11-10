
'use strict';

const helper = require('./helpers');
const models = require('./../server/models/index');

const RoleService = {

  /**
  * @method addRole
  *
  * Saves a new role to the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  addRole: (req, res) => {
    models.Roles.findOne({
      where: { title: req.body.title }
    }).then((role) => {
      if (!role) {
        models.Roles.create({
          title: req.body.title
        }).then ((role) => {
          helper.sendResponse(res, 200, role);
        }).catch((error) => {
          helper.sendResponse(res, 500, error);
        });
      } else {
        helper.sendMessage(res, 409, 'role title already exists');
      }
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  },

  /**
  * @method updateRole
  *
  * Updates attributes of a Role
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @param {Object} role Role to be updated
  * @return {Void}
  */
  updateRole: (req, res, role) => {
    role.updateAttributes({
      title: req.body.title
    }).then((role) => {
      helper.sendResponse(res, 200, role);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }
};

module.exports = RoleService;
