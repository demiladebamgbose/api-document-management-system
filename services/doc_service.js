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
          type: DocService.getType(req),
          RoleId: req.decoded.RoleId,
          OwnerId: req.decoded.OwnerId
        }).then((document) => {
          helper.sendResponse(res, 201, document);
        }).catch((error) => {
          helper.sendResponse(res, 500, error);
        });
      } else {
        helper.sendMessage(res, 409, 'Title already exists');
      }
    });
  },

  /**
  * @method getType
  *
  * Determines if the type is public or private
  *
  * @param {Object} req An instance of request
  * @return {String} public or private
  */
  getType: (req) => {
    if (req.body.type !== 'private') {
      return 'public';
    }
    return 'private';
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
      queryObj = { createdAt: {$gt: req.query.date }};
    }
    models.Roles.findOne({
      where: {id: req.decoded.RoleId}
    }).then((role) => {
      if (role.title === 'Admin') {
        DocService.queryAsAdmin(req, res , size, offset, queryObj);
      } else {
        DocService.queryAsUser(req, res , size, offset, queryObj);
      }
    });
  },

  queryAsAdmin: (req, res, size, offset, queryObj) => {
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

  queryAsUser: (req, res, size, offset, queryObj) => {
    models.Documents.findAll({
      order: '"createdAt" DESC',
      limit: size,
      offset: offset,
      where: {
        $or: [
          {
            $and: [queryObj, {type: 'public'}]
          },
          {
            $and: [queryObj, {type: 'private'}, {OwnerId: req.decoded.OwnerId}]
          },
        ]

      }
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
      type: req.body.type
    }, {fields: Object.keys(req.body)}).then((document) => {
      helper.sendResponse(res, 201, document);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  },

  getUserDocument: (req, res, size, offset) => {
    models.Documents.findAll({
      order: '"createdAt" DESC',
      limit: size,
      offset: offset,
      where: {
        $or: [
          {OwnerId: req.params.id},
          {type: 'public'}
        ]
      }
    }).then((documents) => {
      if (documents) {
        helper.sendResponse(res, 200, documents);
      } else {
        helper.sendMessage(res, 404, 'User has no documents');
      }
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  },

  getAdminDocument: (req, res, size, offset) => {
    models.Documents.findAll({
      order: '"createdAt" DESC',
      limit: size,
      offset: offset
    }).then((documents) => {
      helper.sendResponse(res, 200, documents);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }
};

module.exports = DocService;
