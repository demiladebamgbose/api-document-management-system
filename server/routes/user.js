// import express from 'express';
import User from './../controllers/User';
import Auth from './../controllers/Auth';
import Helper from './../../services/Helpers';

// const router = express.Router();

/**
* Creates routes to access Users resource.
*
* @param {Object} router An instance of express router.
* @return {void}
*/
const userRoutes = (router) => {
  // Users Routes.
  router.route('/users')
    .post(User.signup)
    .get(Auth.validateToken, Helper.checkAdminAccess, User.allUsers);
  router.route('/users/login')
    .post(User.login);
  router.route('/users/:id')
    .delete(Auth.validateToken, User.deleteUser)
    .get(Auth.validateToken, User.findUser)
    .put(Auth.validateToken, User.updateUser);
  router.route('/users/logout')
    .post(User.logout);

  // app.use('/api/', router);
};

export default userRoutes;
