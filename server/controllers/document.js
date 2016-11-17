
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
    helper.checkRole(req.decoded.RoleId).then((role) => {
      if (role) {
        docServ.validateDocument(req, res);
      } else {
        helper.sendMessage(res, 404, 'Role does not exist');
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
    const paginate = docServ.paginate(res, req.query.limit, req.query.page);

    let size = paginate[0];
    let offset = paginate[1];

    // Find all documents created by the user or belongs to same role as user
    models.Roles.findOne({
      where: {id: req.decoded.RoleId}
    }).then((role) => {
      if (role.title === 'Admin') {
        docServ.getAdminDocument(req, res, size, offset);
      } else {
        docServ.getUserDocument(req, res, size, offset);
      }
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
        helper.sendMessage(res, 404,
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
    const paginate = docServ.paginate(res, req.query.limit, req.query.page);

    let size = paginate[0];
    let offset = paginate[1];

    // Find all documents created by the user or belongs to same role as user
    models.Roles.findOne({
      where: {id: req.decoded.RoleId}
    }).then((role) => {
      if (role.title === 'Admin') {
        docServ.getAdminDocument(req, res, size, offset);
      } else {
        docServ.getUserDocument(req, res, size, offset);
      }
    });
  }
};

module.exports = Document;
