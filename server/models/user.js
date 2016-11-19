'use strict';

// Models definition for Users
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    RoleId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        Users.belongsTo(models.Roles, {
          foreignKey: {
            allowNull: false
          }
        });

        Users.hasMany(models.Documents, { foreignKey: 'OwnerId' });
      }
    }
  });

  return Users;
};
