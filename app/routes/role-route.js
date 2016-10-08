var express = require('express');
var router = express.Router();

module.exports = function (app) {
  var Role = require('./../controllers/role.js');
  var User = require('./../controllers/user.js');

  router.route('/create/role')
    .post(Role.createRole);
  router.route('/roles')
    .get(User.verifyToken, Role.getRoles);
  router.route('/role/delete')
    .delete(Role.deleteRole);

    app.use('/api/', router);
};
