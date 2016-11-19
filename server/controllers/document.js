import models from './../models/index';
import helper from './../../services/helpers';
import documentService from './../../services/DocumentService';

/**
* Controller methods to be called on document resource
*
* @return {void}
*/
class Document {

  /**
  * Creates a document and saves it in the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  createDocument(req, res) {
    // Ensures user belongs to an existing Role
    helper.checkRole(req.decoded.RoleId).then((role) => {
      if (role) {
        documentService.validateDocument(req, res);
      } else {
        helper.sendMessage(res, 404, 'Role does not exist');
      }
    });
  }

  /**
  * Retrieves all documents from the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  all(req, res) {
    if ((req.query.date) || (req.query.RoleId)) {
      // Calls queryDocuments to filter by dates and role
      documentService.queryDocuments(req, res);
      return;
    }
    // Pagination logic
    const paginate = documentService.paginate(res, req.query.limit, req.query.page);

    const size = paginate[0];
    const offset = paginate[1];

    // Find all documents created by the user or belongs to same role as user
    models.Roles.findOne({
      where: { id: req.decoded.RoleId }
    }).then((role) => {
      if (role.title === 'Admin') {
        documentService.getAdminDocument(req, res, size, offset);
      } else {
        documentService.getUserDocument(req, res, size, offset);
      }
    });
  }

  /**
  * Retrieves a document from the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  findDocument(req, res) {
    // Finds a unique document in the database by params.id
    models.Documents.findOne({
      where: { id: req.params.id }
    }).then((document) => {
      helper.sendResponse(res, 200, document);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }

  /**
  * Deletes a document from the database based on params.Id
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  deleteDocument(req, res) {
    models.Documents.destroy({
      where: { id: req.params.id }
    }).then((document) => {
      helper.sendResponse(res, 200, document);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }

  /**
  * Updates all or some of the attributes of the document
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  updateDocument(req, res) {
    // Finds a unique document in the database by params.id
    models.Documents.find({
      where: { id: req.params.id }
    }).then((document) => {
      if (document) {
        // Updates all or some of the attributes of the document
        documentService.updateDocument(req, res, document);
      } else {
        helper.sendMessage(res, 404,
          'Failed to update document. Document does not exist');
      }
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }

  /**
  * Retrieves all document from the database accessible to a specific user
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  getUserDocument(req, res) {
    // Pagination logic
    const paginate = documentService.paginate(res, req.query.limit, req.query.page);

    const size = paginate[0];
    const offset = paginate[1];

    // Find all documents created by the user or belongs to same role as user
    models.Roles.findOne({
      where: { id: req.decoded.RoleId }
    }).then((role) => {
      if (role.title === 'Admin') {
        documentService.getAdminDocument(req, res, size, offset);
      } else {
        documentService.getUserDocument(req, res, size, offset);
      }
    });
  }
}

export default new Document();
