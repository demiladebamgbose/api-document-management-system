var express = require('express');
var router = express.Router();

module.exports = function (app) {
  var Role = require('./../controllers/role');
  var User = require('./../controllers/user');

  router.route('/create/role')
    .post(Role.createRole);
  router.route('/roles')
    .get(User.verifyToken, Role.all);
  router.route('/role/:id')
    .delete(User.verifyToken, Role.deleteRole)
    .put(User.verifyToken, Role.updateRole);

  app.use('/api/', router);
};
