var express = require('express');
var router = express.Router();

module.exports = function (app) {
  var User = require('./../controllers/user');
  var Document = require('./../contollers/document'); 

  app.use('/api/', router);
}
