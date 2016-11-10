'use strict';

// Models definition for Users
module.exports = (sequelize, DataTypes) => {
  const Documents = sequelize.define('Documents', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    RoleId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        Documents.belongsTo(models.Roles,{
          foreignKey: {
            allowNull: false
          }
        });
        Documents.belongsTo(models.Users,{
          as: 'Owner',
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Documents;
};
