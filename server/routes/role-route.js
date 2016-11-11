
'use strict';

const express = require('express');
const router = express.Router();

/**
* Creates routes to access Roles resource.
*
* @param {Object} app An instance of express.
* @return {Void}
*/
module.exports = (app) => {
  const Role = require('./../controllers/role');
  const Auth = require('./../controllers/auth');
  const Helper = require('./../../services/helpers');

  // Roles Routes.
  router.route('/roles')
    .post(Auth.validateToken, Helper.checkAdminAccess, Role.createRole)
    .get(Auth.validateToken, Helper.checkAdminAccess, Role.all);
  router.route('/roles/:id')
    .delete(Auth.validateToken, Helper.checkAdminAccess, Role.deleteRole)
    .put(Auth.validateToken, Helper.checkAdminAccess, Role.updateRole)
    .get(Auth.validateToken, Helper.checkAdminAccess, Role.findRole);

  app.use('/api/', router);
};
