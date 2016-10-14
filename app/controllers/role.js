var models = require('./../models/index');
var Role = {};

Role.createRole = function (req, res) {
  models.Roles.findOne({
    where: {
      title: req.body.title
    }
  }).then(function (role) {
    if (!role) {
      models.Roles.create({
        title: req.body.title
      }).then (function (role) {
        res.json(role);
      }).catch (function (error) {
        res.json(error);
      });
    } else {
      res.json({
        message: 'role title already exists'
      });
    }
  }).catch (function (error) {
    res.json(error);
  });
};

Role.all = function (req, res) {
  models.Roles.findAll({})
  .then (function (roles) {
    res.json(roles);
  }).catch (function (error) {
    res.json(error);
  });
};

Role.deleteRole = function (req, res) {
  models.Roles.destroy({
    where: {
      title: req.params.title
    }
  }).then(function(role) {
    res.json(role);
  }).catch(function (error) {
    res.json(error);
  });
};

module.exports = Role;
