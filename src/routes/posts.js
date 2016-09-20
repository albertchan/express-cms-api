import {
  index,
  add,
  create,
  edit,
  read,
  update
} from '../controllers/post_controller';

// ------------------------------------
// Users
// ------------------------------------
export default (server) => {
  server.get('/posts', index);

  server.post('/posts/new', create);

  server.get('/posts/new', add);

  server.get('/posts/:id', read);

  server.get('/posts/:id/edit', edit);

  server.post('/posts/:id/edit', update);
}
