(function () {
  'use strict';
  var moment = require('moment');
  module.exports = {
    up: function (queryInterface) {
      return queryInterface.bulkInsert('Users', [{
        id: 2,
        emailaddress: 'demilade@gmail.com',
        firstname: 'demi',
        lastname: 'bamgbose',
        username: 'demi',
        password: '12345678',
        RoleId: 2,
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format()
      }, {
        id: 3,
        emailaddress: 'winner@gmail.com',
        firstname: 'winner',
        lastname: 'bolorunduro',
        username: 'winner',
        password: '12345678',
        RoleId: 3,
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format()
      }, {
        id: 4,
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

    down: function(queryInterface) {
      return queryInterface.bulkDelete('Users', {emailaddress:
        ['demilade@gmail.com', 'winner@gmail.com', 'ralph@gmail.com', 'lade@gmail.com']});
    }
  };

})();
