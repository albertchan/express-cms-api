import express from 'express';
import error from '../../lib/errors';
import {
  findPage,
  readByID,
  readBySlug,
  readPostByProfile,
} from '../../controllers/post_controller';
import {
  read,
  updateByUserID,
} from '../../controllers/profile_controller';

const router = express.Router();

// ------------------------------------
// Profiles API
// ------------------------------------
router.route('/profiles/:type(@):id')
  .get(read)
  .post(error.methodNotAllowed)
  .put(error.methodNotAllowed)
  .delete(error.methodNotAllowed);

router.route('/profiles/:id/edit')
  .get(error.methodNotAllowed)
  .post(updateByUserID)
  .put(error.methodNotAllowed)
  .delete(error.methodNotAllowed);

router.route('/profiles/:user_id/posts')
  .get(findPage)
  .post(error.methodNotAllowed)
  .put(error.methodNotAllowed)
  .delete(error.methodNotAllowed);

router.route('/profiles/:user_id/posts/:post_id')
  .get(readPostByProfile)
  .post(error.methodNotAllowed)
  .put(error.methodNotAllowed)
  .delete(error.methodNotAllowed);

export default router;
