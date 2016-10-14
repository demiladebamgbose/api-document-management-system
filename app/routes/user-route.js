var express = require('express');
var router = express.Router();

module.exports = function (app) {
  var User = require('./../controllers/user');
  router.route('/signup')
    .post(User.signup);
  router.route('/login')
    .post(User.login);
  router.route('/users')
    .get(User.verifyToken, User.allUsers);
  router.route('/users/:emailaddress/delete')
    .delete(User.deleteUser);

  app.use('/api/', router);
};
