'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
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
        Users.belongsTo(models.Roles,{
          foreignKey: {
            allowNull: false
          }
        });
        Users.hasMany(models.Documents);
      }
    }
  });
  return Users;
};
