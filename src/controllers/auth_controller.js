import validator from 'validator';
import { User } from '../models/user';

export function add(req, res) {
  res.render('auth/new', {
    title: 'Login',
    changeset: {}
  });
}

export function login(req, res) {
  if (!req.body) return res.status(400);
  const changeset = req.body;

  User.check(changeset).then(user => {
    req.session.user = {
      id: user.id,
      username: user.username
    };
    res.redirect('/users');
  }).catch(err => {
    const errors = [
      {
        code: 401,
        message: err.message
      }
    ];

    res.render('auth/new', {
      title: 'Login',
      changeset: changeset,
      errors: errors
    });
  });
}

export function logout(req, res) {
  req.session.destroy();
  res.redirect('/');
}

function checkPassword() {

}
