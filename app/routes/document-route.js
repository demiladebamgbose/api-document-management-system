var express = require('express');
var router = express.Router();

module.exports = function (app) {
  var User = require('./../controllers/user');
  var Document = require('./../controllers/document');

  router.route('/documents')
   .post(User.verifyToken, Document.createDocument)
   .get(User.verifyToken, Document.all);
  router.route('/documents/:id')
   .delete(User.verifyToken, Document.deleteDocument)
   .put(User.verifyToken, Document.updateDocument)
   .get(User.verifyToken, Document.findDocument);


  app.use('/api/', router);
};
