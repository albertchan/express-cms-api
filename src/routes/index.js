import cors from 'cors';
import apiMiddlewares from './v1/middlewares';
import apiAuth from './v1/auth';
import apiPosts from './v1/posts';
import apiProfiles from './v1/profiles';
import apiUsers from './v1/users';

export default (server) => {
  // Enable cors
  server.options('*', cors())
  server.use('/api/v1', apiMiddlewares);
  server.use('/api/v1', [apiAuth, apiPosts, apiUsers, apiProfiles]);
}
