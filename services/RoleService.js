import helper from './helpers';
import models from './../server/models/index';

/**
* Provides service methods for Roles
*
* @return {void}
*/
class RoleService {

  /**
  * Saves a new role to the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  addRole(req, res) {
    models.Roles.findOne({
      where: { title: req.body.title }
    }).then((role) => {
      if (!role) {
        models.Roles.create({
          title: req.body.title,
        }).then((roles) => {
          helper.sendResponse(res, 201, roles);
        }).catch((error) => {
          helper.sendResponse(res, 500, error);
        });
      } else {
        helper.sendMessage(res, 409, 'role title already exists');
      }
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }

  /**
  * Updates attributes of a Role
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @param {Object} role Role to be updated
  * @return {void}
  */
  updateRole(req, res, role) {
    role.updateAttributes({
      title: req.body.title,
    }).then((roles) => {
      helper.sendResponse(res, 201, roles);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }
}

export default new RoleService();
