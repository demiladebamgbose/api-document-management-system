var models = require('./../models/index');
var helper = require('./helpers');

var Document = {};

Document.createDocument = function (req, res) {
  if (helper.validateInput(req.body.title) &&
   helper.validateInput(req.body.content)) {
    models.Documents.create({
      title: req.body.title,
      content: req.body.content,
      RoleId: req.body.RoleId,
      OwnerId: req.decoded.OwnerId
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

Document.all = function (req, res) {
  models.Documents.findAll({})
   .then(function (documents) {
     res.json(documents);
   }).catch(function (error) {
     res.status(500).json(error);
   });
};

Document.findDocument = function (req, res) {
  models.Documents.findOne({
    where: { id: req.params.id}
  }).then(function (document) {
    res.json(document);
  }).catch(function (error) {
    res.staus(500).json(error);
  });
};

Document.deleteDocument = function (req, res) {
  models.Documents.destroy({
    where: { id: req.params.id }
  }).then(function (document) {
    res.json(document);
  }).catch(function (error) {
    res.status(500).json(error);
  });
};

module.exports = Document;
