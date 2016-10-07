'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    emailaddress: DataTypes.STRING,
    password: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    RoleId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        User.belongsTo(models.Role,{
          foreignKey: {
            allowNull: false
          }
        });
        User.hasMany(models.Document);
      }
    }
  });
  return User;
};
