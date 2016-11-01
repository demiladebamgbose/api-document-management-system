(() => {
  'use strict';

  const moment = require('moment');

  module.exports = {

    /**
    * @method up
    *
    * Seeds the Users table before running tests.
    *
    * @param {Object} queryInterface
    * @return {Void}
    */
    up: (queryInterface) => {
      return queryInterface.bulkInsert('Users', [{
        id: 3,
        emailaddress: 'demilade@gmail.com',
        firstname: 'demi',
        lastname: 'bamgbose',
        username: 'demi',
        password: '12345678',
        RoleId: 3,
        createdAt: moment().add(-1, 'days').utc().format(),
        updatedAt: moment().add(-1, 'days').utc().format()
      }, {
        id: 4,
        emailaddress: 'winner@gmail.com',
        firstname: 'winner',
        lastname: 'bolorunduro',
        username: 'winner',
        password: '12345678',
        RoleId: 5,
        createdAt: moment().add(-1, 'days').utc().format(),
        updatedAt: moment().utc().format()
      }, {
        id: 5,
        emailaddress: 'ralph@gmail.com',
        firstname: 'ralph',
        lastname: 'olutola',
        username: 'ralph',
        password: '12345678',
        RoleId: 4,
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format()
      }], {});
    },

    /**
    * @method down
    *
    * Unseed the Users table after running tests.
    *
    * @param {Object} queryInterface
    * @return {Void}
    */
    down: (queryInterface) => {
      return queryInterface.bulkDelete('Users', {emailaddress:
        ['demilade@gmail.com', 'winner@gmail.com', 'ralph@gmail.com', 'lade@gmail.com']});
    }
  };

})();
