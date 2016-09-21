import express from 'express';
import error from '../../lib/errors';
import {
  read,
  update
} from '../../controllers/profile_controller';

const router = express.Router();

// ------------------------------------
// Users API
// ------------------------------------
router.route('/profiles/:id')
  .get(read)
  .post(error.methodNotAllowed)
  .put(error.methodNotAllowed)
  .delete(error.methodNotAllowed);

router.route('/profiles/:id/edit')
  .get(error.methodNotAllowed)
  .post(error.methodNotAllowed)
  .put(update)
  .delete(error.methodNotAllowed);

export default router;
