import validator from 'validator';
import { User } from '../models/user';
import { Profile } from '../models/profile';

export function findPage(req, res) {
  User.findPage().then(result => {
    const payload = result;
    res.status(200).json(result);
  }).catch(err => {
    console.log(err);
    res.status(400).json({error: 'Oops'});
  });
}

export function create(req, res, next) {
  if (!req.body) return res.status(400);

  const changeset = req.body;
  User.add(changeset).then(result => {
    if (result.user_id) {
      res.redirect('/users');
    }
  });
}

export function read(req, res) {
  const id = req.params.id;
  if (isNaN(id)) {
    res.status(400).json({error: 'Bad request'});
  }

  User.findOne({id: validator.toInt(id)}).then(user => {
    const userData = user.toJSON();
    delete userData.password;
    res.status(200).json(userData);
  }).catch(err => {
    console.error(err.message);
    res.status(404).json({error: 'User not found'});
  });
}

export function update(req, res) {
  res.render('user/edit', {
    title: 'Edit user'
  });
}

export function destroy(req, res) {
  res.status(200).json();
}

/**
 * doQuery
 * Makes the call to the Model layer
 *
 * @param {Object} options
 * @returns {Object} options
 */
function doQuery(options) {
  const newUser = options;

  if (newUser.email) {

  } else {
    return Promise.reject(new Error('An email must be provided.'));
  }

  User.getByEmail(newUser.email).then(foundUser => {
    if (!foundUser) {
      return User.add(newUser, options);
    } else {
      return Promise.reject(new Error('User with that email already exists.'));
    }
  });
}
