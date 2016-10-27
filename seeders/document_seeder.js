 (function () {
   'use strict';
   var moment = require('moment');
   module.exports = {
     
    /**
    * @method up
    *
    * Seeds the Documents table before running tests.
    *
    * @param {Object} queryInterface
    * @return {Void}
    */

     up: function (queryInterface) {
       return queryInterface.bulkInsert('Documents', [{
         id: 3,
         title: 'Serious document',
         content: 'This right here is a serious document. owned by ralph admin role',
         RoleId: 2,
         OwnerId:4,
         createdAt: moment().add(-1, 'days').utc().format(),
         updatedAt: moment().utc().format()
       }, {
         id: 4,
         title: 'Yellow document',
         content: 'Content of this document are yellow. Owned by winner with role user',
         RoleId: 3,
         OwnerId:3,
         createdAt: moment().utc().format(),
         updatedAt: moment().utc().format()
       }, {
         id: 5,
         title: 'Purple document',
         content: 'Purple is owned by demi with role guest',
         RoleId: 4,
         OwnerId:2,
         createdAt: moment().add(-1, 'days').utc().format(),
         updatedAt: moment().utc().format()
       }, {
         id: 6,
         title: 'Grey document',
         content: 'Grey is a document owned by winner with role admin',
         RoleId: 2,
         OwnerId:3,
         createdAt: moment().utc().format(),
         updatedAt: moment().utc().format()
       },{
         id: 7,
         title: 'Indigo document',
         content: 'Indigo is pretty. owned by demi with role user',
         RoleId: 3,
         OwnerId:2,
         createdAt: moment().utc().format(),
         updatedAt: moment().utc().format()
       },{
         id: 8,
         title: 'Silver document',
         content: 'Silver is owned by ralph with role guest',
         RoleId: 4,
         OwnerId:4,
         createdAt: moment().utc().format(),
         updatedAt: moment().utc().format()
       },{
         id: 9,
         title: 'Gold document',
         content: 'Gold is a sample document owned by winner with role admin',
         RoleId: 2,
         OwnerId:3,
         createdAt: moment().utc().format(),
         updatedAt: moment().utc().format()
       },{
         id: 10,
         title: 'Peach document',
         content: 'Peach is a shade of perfect.Owned by winner with role user  ',
         RoleId: 3,
         OwnerId:3,
         createdAt: moment().utc().format(),
         updatedAt: moment().utc().format()
       },{
         id: 11,
         title: 'Magenta document',
         content: 'Magenta magent.Owned by winner with role guest',
         RoleId: 4,
         OwnerId:3,
         createdAt: moment().utc().format(),
         updatedAt: moment().utc().format()
       },{
         id: 12,
         title: 'Crystal document',
         content: 'This crystal doc is owned by ralph with role Admin',
         RoleId: 2,
         OwnerId:4,
         createdAt: moment().utc().format(),
         updatedAt: moment().utc().format()
       }],{});
     },

     /**
     * @method down
     *
     * Unseed the Documents table after tests.
     *
     * @param {Object} queryInterface
     * @return {Void}
     */
     down: function(queryInterface) {
       return queryInterface.bulkDelete('Documents',
        {id:  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]});
     }
   };

 })();
