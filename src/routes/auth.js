import {
  add,
  login,
  logout
} from '../controllers/auth_controller';

// ------------------------------------
// Users
// ------------------------------------
export default (server) => {
  server.get('/login', add);

  server.post('/login', login);

  server.get('/logout', logout);
}
