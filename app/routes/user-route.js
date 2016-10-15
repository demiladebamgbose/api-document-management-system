var express = require('express');
var router = express.Router();

module.exports = function (app) {
  var User = require('./../controllers/user');
  router.route('/users')
    .post(User.signup)
    .get(User.verifyToken, User.allUsers);
  router.route('/users/login')
    .post(User.login);
  router.route('/users/:id')
    .delete(User.verifyToken, User.deleteUser)
    .get(User.verifyToken, User.findAUser);
  router.route('/users/logout')
    .post(User.logout);
  app.use('/api/', router);
};
