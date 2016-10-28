(function () {
  'use strict';
  module.exports = {

    /**
    * @method up
    *
    * Creates table Users in the database
    *
    * @param {Object} queryInterface
    * @param {Object} Sequelize
    * @return {method} queryInterface.createTable
    */
    up: function(queryInterface, Sequelize) {
      return queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        emailaddress: {
          allowNull: false,
          type: Sequelize.STRING
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING
        },
        firstname: {
          allowNull: false,
          type: Sequelize.STRING
        },
        lastname: {
          allowNull: false,
          type: Sequelize.STRING
        },
        RoleId: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        username: {
          allowNull: false,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    },

    /**
    * @method down
    *
    * Deletees table Users from the database
    *
    * @param {Object} queryInterface
    * @param {Object} Sequelize
    * @return {method} queryInterface.dropTable
    */
    // eslint-disable-next-line
    down: function(queryInterface, Sequelize) {
      return queryInterface.dropTable('Users');
    }
  };
})();
