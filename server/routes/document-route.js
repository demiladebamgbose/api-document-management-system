'use strict';

const express = require('express');
const router = express.Router();

/**
* Creates routes to access Documents resource.
*
* @param {Object} app An instance of express.
* @return {Void}
*/
module.exports = (app) => {
  const Auth = require('./../controllers/auth');
  const Document = require('./../controllers/document');

  // Documents Routes.
  router.route('/documents')
   .post(Auth.validateToken, Document.createDocument)
   .get(Auth.validateToken, Document.all);
  router.route('/documents/:id')
   .delete(Auth.validateToken, Document.deleteDocument)
   .put(Auth.validateToken, Document.updateDocument)
   .get(Auth.validateToken, Document.findDocument);
  router.route('/users/:id/documents')
    .get(Auth.validateToken, Document.getUserDocument);


  app.use('/api/', router);
};
