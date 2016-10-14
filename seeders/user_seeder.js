(function () {
  'use strict';
  var moment = require('moment');
  module.exports = {
    up: function (queryInterface) {
      return queryInterface.bulkInsert('Users', [{
        id: 1,
        email: 'demilade@gmail.com',
        firstname: 'demilade',
        lastname: 'bamgbose',
        username: 'dem',
        password: '12345678',
        RoleId: 1,
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format()
      }, {
        id: 2,
        email: 'winner@gmail.com',
        firstname: 'winner',
        lastname: 'bolorunduro',
        username: 'winner',
        password: '12345678',
        RoleId: 2,
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format()
      }, {
        id: 3,
        email: 'ralph@gmail.com',
        firstname: 'ralph',
        lastname: 'olutola',
        username: 'ralph',
        password: '12345678',
        RoleId: 1,
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format()
      }], {});
    },

    down: function(queryInterface) {
      return queryInterface.bulkDelete('Categories', null, {});
    }
  };

})();
