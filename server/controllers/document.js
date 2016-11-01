(() => {
  'use strict';

  const models = require('./../models/index');
  const helper = require('./../../services/helpers');
  const docServ = require('./../../services/doc_service');

  // Controller methods to be called on document resource
  const Document = {

    /**
    * @method createDocument
    *
    * Creates a document and saves it in the database
    *
    * @param {Object} req An instance of request
    * @param {Object} res An instance of response
    * @return {Void}
    */
    createDocument: (req, res) => {
      // Ensures user belongs to an existing Role
      helper.checkRole(req.body.RoleId).then((role) => {
        if (role) {
          docServ.validateDocument(req, res);
        } else {
          helper.sendMessage(res, 422, 'Role does not exist');
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
    all: (req, res) => {
      if ((req.query.date) || (req.query.RoleId)) {
        // Calls queryDocuments to filter by dates and role
        docServ.queryDocuments(req, res);
        return;
      }
      // Pagination logic
      let size = req.query.limit;
      let offset = docServ.paginate(res, size, req.query.page);

      // Get a limited number of documents in decending order by createdAt
      models.Documents.findAll({ order: '"createdAt" DESC',
       limit: size, offset: offset })
       .then((documents) => {
         helper.sendResponse(res, 200, documents);
       }).catch((error) => {
         helper.sendResponse(res, 500, error);
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
    findDocument: (req, res) => {
      // Finds a unique document in the database by params.id
      models.Documents.findOne({
        where: { id: req.params.id}
      }).then((document) => {
        helper.sendResponse(res, 200, document);
      }).catch((error) => {
        helper.sendResponse(res, 500, error);
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
    deleteDocument: (req, res) => {
      models.Documents.destroy({
        where: { id: req.params.id }
      }).then((document) => {
        helper.sendResponse(res, 200, document);
      }).catch((error) => {
        helper.sendResponse(res, 500, error);
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
    updateDocument: (req, res) => {
      // Finds a unique document in the database by params.id
      models.Documents.find({
        where: { id: req.params.id }
      }).then((document) => {
        if (document) {
          // Updates all or some of the attributes of the document
          docServ.updateDocument(req, res, document);
        } else {
          helper.sendMessage(res, 422,
            'Failed to update document. Document does not exist');
        }
      }).catch((error) => {
        helper.sendResponse(res, 500, error);
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
    getUserDocument: (req, res) => {
      // Pagination logic
      let size = req.query.limit;
      let offset = docServ.paginate(res, size, req.query.page);

      // Find all documents created by the user or belongs to same role as user
      models.Documents.findAll({
        order: '"createdAt" DESC',
        limit: size,
        offset: offset,
        where: {
          $or: [{OwnerId: req.params.id}, {RoleId: req.decoded.RoleId}]
        }
      }).then((documents) => {
        if (documents) {
          helper.sendResponse(res, 200, documents);
        } else {
          helper.sendMessage(res, 401, 'User has no documents');
        }
      }).catch((error) => {
        helper.sendResponse(res, 500, error);
      });
    }
  };

  module.exports = Document;

})();
