import roleRoutes from './role';
import userRoutes from './user';
import documentRoutes from './document';


const routes = (router) => {
  roleRoutes(router);
  userRoutes(router);
  documentRoutes(router);
};

export default routes;
