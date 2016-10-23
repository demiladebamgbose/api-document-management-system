var express = require('express');
var router = express.Router();

module.exports = function (app) {
  var Role = require('./../controllers/role');
  var User = require('./../controllers/user');

  router.route('/roles')
    .post(Role.createRole)
    .get(User.verifyToken, Role.all);
  router.route('/roles/:id')
    .delete(User.verifyToken, Role.deleteRole)
    .put(User.verifyToken, Role.updateRole)
    .get(Role.findRole);

  app.use('/api/', router);
};
