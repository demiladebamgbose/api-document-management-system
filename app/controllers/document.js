var models = require('./../models/index');
var helper = require('./helpers');

var Document = {};

Document.createDocument = function (req, res) {
  helper.checkRole(req.body.RoleId).then(function (role) {
    if (role) {
      if (helper.validateInput(req.body.title) &&
       helper.validateInput(req.body.content)) {
        addDocument(req, res);
      } else {
        res.status(422).json({
          success: false,
          message: 'title or content cannot be empty'
        });
      }
    } else {
      res.status(422).json({
        success: false,
        message: 'role does not exist'
      });
    }
  });

};

var addDocument = function (req, res) {
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
};

Document.all = function (req, res) {
  models.Documents.findAll({ limit: 3, offset: 3 })
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

Document.updateDocument = function (req, res) {
  models.Documents.find({
    where: { id: req.params.id }
  }).then(function (document) {
    if (document) {
      console.log(Object.keys(req.body));
      document.updateAttributes({
        title: req.body.title,
        content: req.body.content,
        RoleId: req.body.RoleId
      }, { fields: Object.keys(req.body) }).then(function () {
        res.json(document);
      }).catch(function (error) {
        res.status(500).json(error);
      });
    } else {
      res.status(422).json({
        success: false,
        message: 'Failed to update document. Document does not exist'
      });
    }
  }).catch(function (error) {
    res.status(500).json(error);
  });
};

module.exports = Document;
