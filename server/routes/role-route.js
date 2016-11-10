
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

  // Roles Routes.
  router.route('/roles')
    .post(Role.createRole)
    .get(Auth.validateToken, Role.all);
  router.route('/roles/:id')
    .delete(Auth.validateToken, Role.deleteRole)
    .put(Auth.validateToken, Role.updateRole)
    .get(Role.findRole);

  app.use('/api/', router);
};
