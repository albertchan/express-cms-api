import validator from 'validator';
import error from '../lib/errors';
import { User } from '../models/user';

export function login(req, res) {
  if (!req.body) return error.badRequest(req, res);
  const changeset = req.body;

  User.check(changeset).then(user => {
    const data = user.toJSON();
    const userData = {
      id: data.id,
      email: data.email,
      username: data.username,
      name: data.name
    };

    req.session.user = {
      id: user.id,
      username: user.username
    };
    res.status(200).json(userData);
  }).catch(err => {
    console.error('[API]:', err.message);
    res.status(401).json({error: err.message});
  });
}

export function logout(req, res) {
  req.session.destroy();
  res.status(200).json({success: 'Logged out successfully'});
}
