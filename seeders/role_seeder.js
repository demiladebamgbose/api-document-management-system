(function () {
  'use strict';
  var moment = require('moment');
  module.exports = {

    /**
    * @method up
    *
    * Seeds the Roles table before running tests.
    *
    * @param {Object} queryInterface
    * @return {Void}
    */
    up: function (queryInterface) {
      return queryInterface.bulkInsert('Roles', [{
        id: 2,
        title: 'Admin',
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format()
      }, {
        id: 3,
        title: 'User',
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format()
      }, {
        id: 4,
        title: 'Guest',
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format()
      }], {});
    },

    /**
    * @method up
    *
    * Unseeds the Roles table after running tests.
    *
    * @param {Object} queryInterface
    * @return {Void}
    */
    down: function(queryInterface) {
      return queryInterface.bulkDelete('Roles',
       {title: ['Admin', 'User', 'Guest']});
    }
  };

})();
