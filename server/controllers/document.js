(function () {
  'use strict';

  var models = require('./../models/index');
  var helper = require('./helpers');

  // Controller methods to be called on document resource
  var Document = {

    /**
    * @method createDocument
    *
    * Creates a document and saves it in the database
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    createDocument: function (req, res) {
      // Ensures user belongs to an existing Role
      helper.checkRole(req.body.RoleId).then(function (role) {
        if (role) {
          validateDocument(req, res);
        } else {
          res.status(422).json({
            success: false,
            message: 'Role does not exist'
          });
        }
      });
    },

    /**
    * @method all
    *
    * Retrieves all documents from the database
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    all: function (req, res) {
      if ((req.query.date) || (req.query.RoleId)) {
        // Calls queryDocuments to filter by dates and role
        queryDocuments(req, res);
        return;
      }
      // Pagination logic
      var size = req.query.limit;
      var page = req.query.page || 1;
      var offset = size * (page - 1);
      // Get a limited number of documents in decending order by createdAt
      models.Documents.findAll({ order: '"createdAt" DESC',
       limit: size, offset: offset })
       .then(function (documents) {
         res.json(documents);
       }).catch(function (error) {
         res.status(500).json(error);
       });
    },

    /**
    * @method findDocument
    *
    * Retrieves a document from the database
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    findDocument: function (req, res) {
      // Finds a unique document in the database by params.id
      models.Documents.findOne({
        where: { id: req.params.id}
      }).then(function (document) {
        res.json(document);
      }).catch(function (error) {
        res.staus(500).json(error);
      });
    },

    /**
    * @method deleteDocument
    *
    * Deletes a document from the database based on params.Id
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    deleteDocument: function (req, res) {
      models.Documents.destroy({
        where: { id: req.params.id }
      }).then(function (document) {
        res.json(document);
      }).catch(function (error) {
        res.status(500).json(error);
      });
    },

    /**
    * @method updateDocument
    *
    * Updates all or some of the attributes of the document
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    updateDocument: function (req, res) {
      // Finds a unique document in the database by params.id
      models.Documents.find({
        where: { id: req.params.id }
      }).then(function (document) {
        if (document) {
          // Updates all or some of the attributes of the document
          document.updateAttributes({
            title: req.body.title,
            content: req.body.content,
            RoleId: req.body.RoleId
          }, {fields: Object.keys(req.body)}).then(function () {
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
    },

    /**
    * @method getUserDocument
    *
    * Retrieves all document from the database accessible to a specific user
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    getUserDocument: function (req, res) {
      // Pagination logic
      var size = req.query.limit;
      var page = req.query.page || 1;
      var offset = size * (page - 1);
      // Find all documents created by the user or belongs to same role as user
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
    }
  };

// Private functions

/**
* @method addDocument
*
* Inserts a document with unique title to the database
*
* @param {Object} req An instance of request
* @param {Object} res An instance of response
* @return {Void}
*/
  function addDocument (req, res) {
    // Checks if document alredy exist
    models.Documents.findOne({
      where: {title: req.body.title}
    }).then(function (document) {
      if (!document) {
        // Creates a unique document
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
          message: 'Title already exists'
        });
      }
    });
  }

  /**
  * @method queryDocuments
  *
  * Gets all document with a certain role or created on a certain date
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  function queryDocuments (req, res) {
    var size = req.query.limit;
    var page = req.query.page || 1;
    var offset = size * (page - 1);
    if (req.query.RoleId) {
      // Gets a limited number documents belonging to the same role and
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
      // Gets a limited number documents created on  the same date
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
  }

  /**
  * @method validateDocument
  *
  * Validates that attributes of document to be created are
  * properly formated
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  function validateDocument (req, res) {
    if (helper.validateRequestBody(req.body)) {
      addDocument(req, res);
    } else {
      res.status(401).json({
        success: false,
        message: 'Feilds cannot be empty'
      });
    }
  }

  module.exports = Document;

})();
