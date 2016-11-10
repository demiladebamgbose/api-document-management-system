'use strict';

module.exports = {

  /**
  * @method up
  *
  * Creates table Documents in the database
  *
  * @param {Object} queryInterface
  * @param {Object} Sequelize
  * @return {method} queryInterface.createTable
  */
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      RoleId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      OwnerId: {
        allowNull: false,
        type: Sequelize.INTEGER
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
  * Deletes table Documents from the database
  *
  * @param {Object} queryInterface
  * @param {Object} Sequelize
  * @return {method} queryInterface.dropTable
  */
  // eslint-disable-next-line
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Documents');
  }
};
