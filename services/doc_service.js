
'use strict';

const helper = require('./helpers');
const models = require('./../server/models/index');

const DocService = {

  /**
  * @method paginate
  *
  * Implements pagination logic
  *
   *@param {Object} res an instance of response array
  * @param {Integer} size size of response array
  * @param {Integer} page  Calculates the offset
  * @return {Boolean} true or false
  */
  paginate: (res, size, page) => {
    if (!page){
      page = 1;
    }
    if (size) {
      return size * (page - 1);
    }
    helper.sendMessage(res, 400, 'Invalid query limit');
  },

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
  validateDocument: (req, res) => {
    if (helper.validateRequestBody(req.body)) {
      DocService.addDocument(req, res);
    } else {
      helper.sendMessage(res, 400, 'Fields cannot be empty');
    }
  },

  /**
  * @method addDocument
  *
  * Inserts a document with unique title to the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  addDocument: (req, res) => {
    // Checks if document alredy exist
    models.Documents.findOne({
      where: { title: req.body.title }
    }).then((document) => {
      if (!document) {
        // Creates a unique document
        models.Documents.create({
          title: req.body.title,
          content: req.body.content,
          RoleId: req.body.RoleId,
          OwnerId: req.decoded.OwnerId
        }).then((document) => {
          helper.sendResponse(res, 200, document);
        }).catch((error) => {
          helper.sendResponse(res, 500, error);
        });
      } else {
        helper.sendMessage(res, 409, 'Title already exists');
      }
    });
  },

  /**
  * @method queryDocuments
  *
  * Gets all document with a certain role or created on a certain date
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {Void}
  */
  queryDocuments: (req, res) => {
    let queryObj;
    let size = req.query.limit;
    let offset = DocService.paginate(res, size, req.query.page);

    if (req.query.RoleId) {
      // Gets a limited number documents belonging to the same role and
      queryObj = { RoleId: req.query.RoleId };
    } else {
      // Gets a limited number documents created on  the same date
      queryObj = { createdAt: req.query.date };
    }
    models.Documents.findAll({
      order: '"createdAt" DESC',
      limit: size,
      offset: offset,
      where: queryObj
    }).then((documents) => {
      helper.sendResponse(res, 200, documents);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  },

  /**
  * @method updateDocument
  *
  * Updates attributes of the document
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @param {Object} document document to be updated
  * @return {Void}
  */
  updateDocument: (req, res, document) => {
    document.updateAttributes({
      title: req.body.title,
      content: req.body.content,
      RoleId: req.body.RoleId
    }, {fields: Object.keys(req.body)}).then((document) => {
      helper.sendResponse(res, 200, document);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }
};

module.exports = DocService;
