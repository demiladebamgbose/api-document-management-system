var models = require('./../models/index');
var auth = require('./auth');
var helper = require('helpers');

var Document = {};
//call validatetoken 4 this guy
Document.createDocument = function (req, res) {
  if (helper.validateInput(req.body.title) &&
   helper.validateInput(req.body.content)) {
    models.Documents.create({
      title: req.body.title,
      content: req.body.content,
      RoleId: req.decoded.RoleId,
      OwnerId: req.decoded.UserId
    }).then(function (document) {
      res.json(document);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  } else {
    res.status(422).json({
      success: false,
      message: 'title or content cannot be empty'
    });
  }
};



module.exports = document;
