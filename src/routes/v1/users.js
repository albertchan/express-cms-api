import express from 'express';
import error from '../../lib/errors';
import {
  create,
  read,
  update,
  destroy,
  findPage
} from '../../controllers/user_controller';

const router = express.Router();

// ------------------------------------
// Users API
// ------------------------------------
router.route('/new-user')
  .get(error.methodNotAllowed)
  .post(create)
  .put(error.methodNotAllowed)
  .delete(error.methodNotAllowed);

router.route('/users')
  .get(findPage)
  .post(error.methodNotAllowed)
  .put(error.methodNotAllowed)
  .delete(error.methodNotAllowed);

router.route('/users/:id')
  .get(read)
  .post(error.methodNotAllowed)
  .put(update)
  .delete(destroy);

router.route('/users/slug/:id')

export default router;
