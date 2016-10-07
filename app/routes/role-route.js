var Role = require('./../controllers/role.js');


module.exports = function(router){
  router.route('/create/role')
    .post(Role.createRole);
  router.route('/roles')
    .get(Role.getRoles);
  router.route('/role/delete')
    .delete(Role.deleteRole);
};
