
'use strict';

const moment = require('moment');

module.exports = {

  /**
  * @method up
  *
  * Seeds the Roles table before running tests.
  *
  * @param {Object} queryInterface
  * @return {Void}
  */
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Roles', [{
      id: 3,
      title: 'Admin',
      createdAt: moment().utc().format(),
      updatedAt: moment().utc().format()
    }, {
      id: 4,
      title: 'User',
      createdAt: moment().utc().format(),
      updatedAt: moment().utc().format()
    }, {
      id: 5,
      title: 'Guest',
      createdAt: moment().utc().format(),
      updatedAt: moment().utc().format()
    }], {});
  },

  /**
  * @method down
  *
  * Unseeds the Roles table after running tests.
  *
  * @param {Object} queryInterface
  * @return {Void}
  */
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Roles',
     {title: ['Admin', 'User', 'Guest']});
  }
};
