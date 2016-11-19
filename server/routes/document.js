import Auth from './../controllers/auth';
import Document from './../controllers/document';

/**
* Creates routes to access Documents resource.
*
* @param {Object} router An instance of express router.
* @return {void}
*/
const documentRoutes = (router) => {
  // Documents Routes.
  router.route('/documents')
   .post(Auth.validateToken, Document.createDocument)
   .get(Auth.validateToken, Document.all);
  router.route('/documents/:id')
   .delete(Auth.validateToken, Document.deleteDocument)
   .put(Auth.validateToken, Document.updateDocument)
   .get(Auth.validateToken, Document.findDocument);
  router.route('/users/:id/documents')
    .get(Auth.validateToken, Document.getUserDocument);
};

export default documentRoutes;
