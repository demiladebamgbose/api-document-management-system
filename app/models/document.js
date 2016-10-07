'use strict';
module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    RoleId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Document.belongsTo(models.Role,{
          foreignKey: {
            allowNull: false
          }
        });
        Document.belongsTo(models.User,{
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Document;
};
