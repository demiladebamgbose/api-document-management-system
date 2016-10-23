var models = require('./../models/index');
var helper = require('./helpers');

var Document = {};

Document.createDocument = function (req, res) {
  helper.checkRole(req.body.RoleId).then(function (role) {
    if (role) {
      validateDocument(req, res);
    } else {
      res.status(422).json({
        success: false,
        message: 'title or content cannot be empty'
      });
    }
  });
};

var validateDocument = function (req, res) {
  if (helper.validateRequestBody(req.body)) {
    if (helper.validateInput(req.body.title) &&
     helper.validateInput(req.body.content)) {
      addDocument(req, res);
    }else {
      res.status(422).json({
        success: false,
        message: 'role does not exist'
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Feilds cannot be empty'
    });
  }
};

var addDocument = function (req, res) {
  models.Documents.findOne({
    where: {title: req.body.title}
  }).then(function (document) {
    if (!document) {
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
        message: 'title already exists'
      });
    }
  });
};

Document.all = function (req, res) {
  if ((req.query.date) || (req.query.RoleId)) {
    queryDocuments(req, res);
    return;
  }
  var size = req.query.size;
  var page = req.query.page;
  var offset = size * (page - 1);
  models.Documents.findAll({ order: '"createdAt" DESC', limit: size, offset: offset })
   .then(function (documents) {
     res.json(documents);
   }).catch(function (error) {
     res.status(500).json(error);
   });
};

var queryDocuments = function (req, res) {
  var size = req.query.size;
  var page = req.query.page;
  var offset = size * (page - 1);
  if (req.query.RoleId) {
    models.Documents.findAll({
      order: '"createdAt" DESC',
      limit: size,
      offset: offset,
      where: { RoleId: req.query.RoleId }
    }).then(function (documents) {
      res.json(documents);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  } else {
    models.Documents.findAll({
      order: '"createdAt" DESC',
      limit: size,
      offset: offset,
      where: { createdAt: req.query.date }
    }).then(function (documents) {
      res.json(documents);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  }

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

Document.getUserDocument = function (req, res) {
  var size = req.query.size;
  var page = req.query.page;
  var offset = size * (page - 1);
  models.Documents.findAll({
    order: '"createdAt" DESC',
    limit: size,
    offset: offset,
    where: {
      $or: [{OwnerId: req.params.id}, {RoleId: req.decoded.RoleId}]
    }
  }).then(function (documents) {
    if (documents) {
      res.json(documents);
    } else {
      res.json({
        message: 'User has no documents'
      });
    }
  }).catch(function (error) {
    res.status(500).json(error);
  });
};

module.exports = Document;
