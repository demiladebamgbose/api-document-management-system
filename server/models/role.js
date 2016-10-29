(function () {
  'use strict';

  // Models definition for Roles
  module.exports = function(sequelize, DataTypes) {
    var Roles = sequelize.define('Roles', {
      title: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          Roles.hasMany(models.Documents);
          Roles.hasMany(models.Users);
        }
      }
    });

    return Roles;
  };
  
})();
