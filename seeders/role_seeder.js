(function () {
  'use strict';

  module.exports = {
    up: function (queryInterface) {
      return queryInterface.bulkInsert('Roles', [{
        id: '1',
        name: 'Admin'
      }, {
        id: '2',
        name: 'User'
      }, {
        id: '3',
        name: 'Guest'
      }], {});
    },

    down: function(queryInterface) {
      return queryInterface.bulkDelete('Categories', null, {});
    }
  };

})();
