import {
  index,
  add,
  create,
  read,
  update
} from '../controllers/user_controller';

// ------------------------------------
// Users
// ------------------------------------
export default (server) => {
  server.get('/users', index);

  server.post('/users/new', create);

  server.get('/users/new', add);

  server.get('/users/:id', read);

  server.get('/users/:id/edit', update);
}
