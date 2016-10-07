var models = require('./../models/index');
var Role = {};

Role.createRole = function (req, res) {
  models.Role.findOne({
    where: {
      title: req.body.title
    }
  }).then(function (role) {
    if (!role) {
      models.Role.create({
        title: req.body.title
      }).then(function (role) {
        res.json(role);
      });
    } else {
      res.json({
        message: 'role title already created'
      });
    }
  }).catch(function (error) {
    res.json(error);
  });
};

Role.getRoles = function (req, res) {
  models.Role.findAll({})
  .then(function (roles) {
    res.json(roles);
  }).catch(function (error) {
    res.json(error);
  });
};

Role.deleteRole = function (req, res) {
  models.Role.destroy({ truncate: true })
  .then(function(deleted){
    res.json(deleted);
  });
};

module.exports = Role;
