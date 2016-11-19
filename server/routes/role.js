import Role from './../controllers/role';
import Auth from './../controllers/auth';
import Helper from './../../services/helpers';

/**
* Creates routes to access Roles resource.
*
* @param {Object} router An instance of express router.
* @return {void}
*/
const roleRoutes = (router) => {
  // Roles Routes.
  router.route('/roles')
    .post(Auth.validateToken, Helper.checkAdminAccess, Role.createRole)
    .get(Auth.validateToken, Helper.checkAdminAccess, Role.all);
  router.route('/roles/:id')
    .delete(Auth.validateToken, Helper.checkAdminAccess, Role.deleteRole)
    .put(Auth.validateToken, Helper.checkAdminAccess, Role.updateRole)
    .get(Auth.validateToken, Helper.checkAdminAccess, Role.findRole);
};

export default roleRoutes;
