'use strict';
module.exports = function(sequelize, DataTypes) {
  var Documents = sequelize.define('Documents', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    RoleId: DataTypes.INTEGER,
    OwnwerId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Documents.belongsTo(models.Roles,{
          foreignKey: {
            allowNull: false
          }
        });
        Documents.belongsTo(models.Users,{
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Documents;
};
