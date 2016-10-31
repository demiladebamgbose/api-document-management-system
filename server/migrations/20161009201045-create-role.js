(() => {
  'use strict';

  module.exports = {

    /**
    * @method up
    *
    * Creates table Roles in the database
    *
    * @param {Object} queryInterface
    * @param {Object} Sequelize
    * @return {method} queryInterface.createTable
    */
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('Roles', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: {
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
    * @method dowm
    *
    * Deletes table Roles from the database
    *
    * @param {Object} queryInterface
    * @param {Object} Sequelize
    * @return {method} queryInterface.dropTable
    */
    //eslint-disable-next-line
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('Roles');
    }
  };

})();
