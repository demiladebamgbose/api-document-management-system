(function () {
  'use strict';

  var models = require('./../models/index');
  var helper = require('./helpers');

  // Controller methods for Roles Resource
  var Role = {

    /**
    * @method createRole
    *
    * Creates a new role ans saves it to the database.
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    createRole:function (req, res) {
      if (helper.validateRequestBody(req.body)) {
        addRole(req, res);
      } else {
        res.status(422).json({
          success:false,
          message: 'Fields cannot be empty'
        });
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
    all: function (req, res) {
      models.Roles.findAll({})
      .then (function (roles) {
        res.json(roles);
      }).catch (function (error) {
        res.status(500).json(error);
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
    updateRole: function (req, res) {
      // Finds one role based on the params.id
      models.Roles.find({
        where: { id: req.params.id }
      }).then(function (role) {
        if (role) {
          //Updates all or some of the attributes of the Role
          role.updateAttributes({
            title: req.body.title
          }).then(function (role) {
            res.json(role);
          }).catch(function (error) {
            res.status(500).json(error);
          });
        } else {
          res.status(422).json({
            success: false,
            message: 'Unable to udate role. Role does not exist'
          });
        }
      }).catch(function (error) {
        res.status(500).json(error);
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
    findRole: function (req, res) {
      models.Roles.findOne({
        where: { id: req.params.id }
      }).then(function (role) {
        if (role) {
          res.json(role);
        } else {
          res.status(400).json({
            success: false,
            message: 'Role does not exist'
          });
        }
      }).catch(function (error) {
        res.status(500).json(error);
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
    deleteRole: function (req, res) {
      models.Roles.destroy({
        where: {
          id: req.params.id
        }
      }).then(function(role) {
        res.json(role);
      }).catch(function (error) {
        res.status(500).json(error);
      });
    }
  };

  /**
  * @method addRole
  *
  * Saves a new role to the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  function addRole (req, res) {
    models.Roles.findOne({
      where: {
        title: req.body.title
      }
    }).then(function (role) {
      if (!role) {
        models.Roles.create({
          title: req.body.title
        }).then (function (role) {
          res.json(role);
        }).catch (function (error) {
          res.status(500).json(error);
        });
      } else {
        res.status(422).json({
          success:false,
          message: 'role title already exists'
        });
      }
    }).catch (function (error) {
      res.status(500).json(error);
    });
  }

  module.exports = Role;
})();
