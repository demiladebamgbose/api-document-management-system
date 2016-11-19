'use strict';

const moment = require('moment');

module.exports = {

  /**
  * Seeds the Users table before running tests.
  *
  * @param {Object} queryInterface
  * @return {void}
  */
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Users', [{
      id: 3,
      emailAddress: 'demilade@gmail.com',
      firstName: 'demi',
      lastName: 'bamgbose',
      username: 'demi',
      password: '$2a$10$cKQgAO5t5b9n31Hp4k8F7OFR7rivwGUs1JpxE9zEpNd7PBYLLZ.tS',
      RoleId: 3,
      createdAt: moment().add(-1, 'days').utc().format(),
      updatedAt: moment().add(-1, 'days').utc().format()
    }, {
      id: 4,
      emailAddress: 'winner@gmail.com',
      firstName: 'winner',
      lastName: 'bolorunduro',
      username: 'winner',
      password: '$2a$10$cKQgAO5t5b9n31Hp4k8F7OFR7rivwGUs1JpxE9zEpNd7PBYLLZ.tS',
      RoleId: 4,
      createdAt: moment().add(-1, 'days').utc().format(),
      updatedAt: moment().utc().format()
    }, {
      id: 5,
      emailAddress: 'ralph@gmail.com',
      firstName: 'ralph',
      lastName: 'olutola',
      username: 'ralph',
      password: '$2a$10$cKQgAO5t5b9n31Hp4k8F7OFR7rivwGUs1JpxE9zEpNd7PBYLLZ.tS',
      RoleId: 4,
      createdAt: moment().utc().format(),
      updatedAt: moment().utc().format()
    }], {});
  },

  /**
  * Unseed the Users table after running tests.
  *
  * @param {Object} queryInterface
  * @return {void}
  */
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', { emailAddress:
      ['demilade@gmail.com', 'winner@gmail.com', 'ralph@gmail.com', 'lade@gmail.com'] });
  }
};
