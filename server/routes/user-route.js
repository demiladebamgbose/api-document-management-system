
'use strict';

const express = require('express');
const router = express.Router();

/**
* Creates routes to access Users resource.
*
* @param {Object} app An instance of express.
* @return {Void}
*/
module.exports = (app) => {
  const User = require('./../controllers/user');
  const Auth = require('./../controllers/auth');

  // Users Routes.
  router.route('/users')
    .post(User.signup)
    .get(Auth.validateToken, User.allUsers);
  router.route('/users/login')
    .post(User.login);
  router.route('/users/:id')
    .delete(Auth.validateToken, User.deleteUser)
    .get(Auth.validateToken, User.findUser)
    .put(Auth.validateToken, User.updateUser);
  router.route('/users/logout')
    .post(User.logout);

  app.use('/api/', router);
};
