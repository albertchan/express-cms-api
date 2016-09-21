import validator from 'validator';
import { User } from '../models/user';
import { Profile } from '../models/profile';

export function read(req, res) {
  const id = req.params.id;
  if (isNaN(id)) {
    res.status(400).json({error: 'Bad request'});
  }

  User.findOne({id: validator.toInt(id)}).then(user => {
    const data = user.toJSON();
    const profileData = {
      id: data.id,
      name: data.name,
      username: data.username,
      avatar_url: data.profile.avatar_url,
      bio: data.profile.bio
    };
    res.status(200).json(profileData);
  }).catch(err => {
    console.error(err.message);
    res.status(404).json({error: 'User not found'});
  });
}

export function update(req, res) {
  res.status(200).json();
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
