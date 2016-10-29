(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();

  /**
  * Creates routes to access Users resource.
  *
  * @param {Object} app An instance of express.
  * @return {Void}
  */
  module.exports = function (app) {
    var User = require('./../controllers/user');

    // Users Routes.
    router.route('/users')
      .post(User.signup)
      .get(User.verifyToken, User.allUsers);
    router.route('/users/login')
      .post(User.login);
    router.route('/users/:id')
      .delete(User.verifyToken, User.deleteUser)
      .get(User.verifyToken, User.findAUser)
      .put(User.verifyToken, User.updateUser);
    router.route('/users/logout')
      .post(User.logout);

    app.use('/api/', router);
  };
  
})();
