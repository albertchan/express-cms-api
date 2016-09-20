import express from 'express';
import error from '../../lib/errors';
import {
  create,
  readByID,
  readBySlug,
  updateByID,
  updateBySlug,
  deleteByID,
  deleteBySlug,
  findPage
} from '../../controllers/post_controller';

const router = express.Router();

// ------------------------------------
// Users API
// ------------------------------------
router.route('/posts')
  .get(findPage)
  .post(error.methodNotAllowed)
  .put(error.methodNotAllowed)
  .delete(error.methodNotAllowed);

router.route('/posts/:id')
  .get(readByID)
  .post(error.methodNotAllowed)
  .put(updateByID)
  .delete(deleteByID);

router.route('/posts/slug/:id')
  .get(readBySlug)
  .post(error.methodNotAllowed)
  .put(updateBySlug)
  .delete(deleteBySlug);

export default router;
