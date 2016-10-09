(function () {
  'use strict';

  module.exports = {
    up: function (queryInterface) {
      return queryInterface.bulkInsert('Roles', [{
        id: '1',
        title: 'Admin',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }, {
        id: '2',
        title: 'User',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }, {
        id: '3',
        title: 'Guest',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }], {});
    },

    down: function(queryInterface) {
      return queryInterface.bulkDelete('Categories', null, {});
    }
  };

})();
