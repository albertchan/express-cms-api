import express from 'express';
import error from '../../lib/errors';
import { login, logout } from '../../controllers/auth_controller';

const router = express.Router();

// ------------------------------------
// Users API
// ------------------------------------
router.route('/login')
  .get(error.methodNotAllowed)
  .post(login)
  .put(error.methodNotAllowed)
  .delete(error.methodNotAllowed);

router.route('/logout')
  .get(logout)
  .post(error.methodNotAllowed)
  .put(error.methodNotAllowed)
  .delete(error.methodNotAllowed);

export default router;
