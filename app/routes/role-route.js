var Role = require('./../controllers/role.js');


module.exports = function(router){
  router.route('/create/role')
    .post(Role.createRole);
};
