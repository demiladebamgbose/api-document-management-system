import helper from './helpers';
import models from './../server/models/index';

/** Provides service methods for Documents */
class DocumentService {

  /**
  * Implements pagination logic
  *
   *@param {Object} res an instance of response array
  * @param {Integer} size size of response array
  * @param {Integer} page  Calculates the offset
  * @return {Boolean} true or false
  */
  paginate(res, size, page) {
    if (!page) {
      page = 1;
    }
    if (!size) {
      const offset = 5 * (page - 1);
      return [5, offset];
    }
    const offset = size * (page - 1);
    return [size, offset];
  }

  /**
  * Validates that attributes of document to be created are
  * properly formated
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  validateDocument(req, res) {
    if (helper.validateRequestBody(req.body)) {
      this.addDocument(req, res);
    } else {
      helper.sendMessage(res, 400, 'Fields cannot be empty');
    }
  }

  /**
  * Inserts a document with unique title to the database
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  addDocument(req, res) {
    // Checks if document alredy exist
    models.Documents.findOne({
      where: { title: req.body.title }
    }).then((document) => {
      if (!document) {
        // Creates a unique document
        models.Documents.create({
          title: req.body.title,
          content: req.body.content,
          type: this.getType(req),
          RoleId: req.decoded.RoleId,
          OwnerId: req.decoded.OwnerId
        }).then((documents) => {
          helper.sendResponse(res, 201, documents);
        }).catch((error) => {
          helper.sendResponse(res, 500, error);
        });
      } else {
        helper.sendMessage(res, 409, 'Title already exists');
      }
    });
  }

  /**
  * Determines if the type is public or private
  *
  * @param {Object} req An instance of request
  * @return {String} public or private
  */
  getType(req) {
    if (req.body.type !== 'private') {
      return 'public';
    }
    return 'private';
  }

  /**
  * Gets all document with a certain role or created on a certain date
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @return {void}
  */
  queryDocuments(req, res) {
    let queryObj;
    const paginate = this.paginate(res, req.query.limit, req.query.page);
    const size = paginate[0];
    const offset = paginate[1];

    if (req.query.RoleId) {
      // Gets a limited number documents belonging to the same role and
      queryObj = { RoleId: req.query.RoleId };
    } else {
      // Gets a limited number documents created on  the same date
      queryObj = { createdAt: { $gt: req.query.date } };
    }
    models.Roles.findOne({
      where: { id: req.decoded.RoleId }
    }).then((role) => {
      if (role.title === 'Admin') {
        this.queryAsAdmin(req, res, size, offset, queryObj);
      } else {
        this.queryAsUser(req, res, size, offset, queryObj);
      }
    });
  }

  queryAsAdmin(req, res, size, offsets, queryObj) {
    models.Documents.findAll({
      order: '"createdAt" DESC',
      limit: size,
      offset: offsets,
      where: queryObj
    }).then((documents) => {
      helper.sendResponse(res, 200, documents);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }

  queryAsUser(req, res, size, offsets, queryObj) {
    models.Documents.findAll({
      order: '"createdAt" DESC',
      limit: size,
      offset: offsets,
      where: {
        $or: [
          {
            $and: [queryObj, { type: 'public' }]
          },
          {
            $and: [queryObj, { type: 'private' }, { OwnerId: req.decoded.OwnerId }]
          },
        ]

      }
    }).then((documents) => {
      helper.sendResponse(res, 200, documents);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }

  /**
  * Updates attributes of the document
  *
  * @param {Object} req An instance of request
  * @param {Object} res An instance of response
  * @param {Object} document document to be updated
  * @return {void}
  */
  updateDocument(req, res, document) {
    document.updateAttributes({
      title: req.body.title,
      content: req.body.content,
      type: req.body.type
    }, { fields: Object.keys(req.body) }).then((documents) => {
      helper.sendResponse(res, 201, documents);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }

  getUserDocument(req, res, size, offsets) {
    models.Documents.findAll({
      order: '"createdAt" DESC',
      limit: size,
      offset: offsets,
      where: {
        $or: [
          { OwnerId: req.params.id || req.decoded.OwnerId },
          { type: 'public' }
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
  }

  getAdminDocument(req, res, size, offsets) {
    models.Documents.findAll({
      order: '"createdAt" DESC',
      limit: size,
      offset: offsets
    }).then((documents) => {
      helper.sendResponse(res, 200, documents);
    }).catch((error) => {
      helper.sendResponse(res, 500, error);
    });
  }
}

export default new DocumentService();
