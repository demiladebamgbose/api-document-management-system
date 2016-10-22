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
        res.status(500).json(error);
      });
    } else {
      res.status(422).json({
        success:false,
        message: 'role title already exists'
      });
    }
  }).catch (function (error) {
    res.status(500).json(error);
  });
};

Role.all = function (req, res) {
  models.Roles.findAll({})
  .then (function (roles) {
    res.json(roles);
  }).catch (function (error) {
    res.status(500).json(error);
  });
};

Role.updateRole = function (req, res) {
  models.Role.find({
    where: { id: req.params.id }
  }).then(function (role) {
    if (role) {
      role.updateAttributes({
        title: req.body.title
      }).then(function (role) {
        res.json(role);
      }).catch(function (error) {
        res.status(500).json(error);
      });
    } else {
      res.status(422).json({
        success: false,
        message: 'Unable to udate role. Role does not exist'
      });
    }
  }).catch(function (error) {
    res.status(500).json(error);
  });
};

Role.deleteRole = function (req, res) {
  models.Roles.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(role) {
    res.json(role);
  }).catch(function (error) {
    res.status(500).json(error);
  });
};

module.exports = Role;
