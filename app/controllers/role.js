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
  });
};

module.exports = Role;
