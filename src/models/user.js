import _union from 'lodash/union';
import bcrypt from 'bcryptjs';
import Promise from 'bluebird';
import validator from 'validator';
import Bookshelf from './base';
import { Profile } from './profile';
import profiles from './profile';
import { bcryptCompare, bcryptHash } from '../lib/utils/bcrypt-then';

export const schema = {
  id: { type: 'increments', nullable: false, primary: true },
  external_id: { type: 'integer', nullable: true, unsigned: true },
  username: { type: 'string', maxlength: 150, nullable: false, unique: true },
  email: { type: 'string', maxlength: 255, nullable: false, unique: true, validations: { isEmail: true }},
  name: { type: 'string', maxlength: 255, nullable: false },
  password: { type: 'string', maxlength: 255, nullable: false },
  timestamps: { type: 'timestamps' }
};

export class User extends Bookshelf.Model {
  get tableName() {
    return 'users';
  }

  get hasTimestamps() {
    return true;
  }

  // Relations
  posts() {
    return this.hasMany('Posts', 'user_id');
  }

  profile() {
    return this.hasOne('Profile');
  }

  /**
   * permittedOptions
   *
   * Returns an array of keys permitted in a method's `options` hash, depending
   * on the current method.
   *
   * @param {String} methodName Name of the method to check valid options for
   * @return {Array} Keys allowed in the `options` hash of the model's method
   */
  static permittedOptions(methodName) {
    let options = Bookshelf.Model.permittedOptions();
    const validOptions = {
      findOne: ['withRelated', 'status'],
      setup: ['id'],
      edit: ['withRelated', 'id'],
      findPage: ['page', 'limit', 'columns', 'filter', 'order', 'status'],
      findAll: ['filter']
    };

    if (validOptions[methodName]) {
      // return validOptions[methodName];
      options = options.concat(validOptions[methodName]);
    }

    return options;
  }

  /**
   * findOne
   *
   * @extends Bookshelf.Model.findOne to include roles
   */
  static findOne(data, options) {
    options = options || {};
    options.withRelated = _union(options.withRelated, ['profile']);

    return this.forge(data).fetch(options);
  }

  /**
   * add
   *
   * Naively adds a user. Hashes the password provided before saving to the
   * database.
   *
   * @param {object} data
   * @param {object} options
   */
  static add(data, options) {
    const userData = {
      email: data.email,
      username: data.username,
      name: data.name,
      password: data.password
    };

    return bcryptHash(userData.password).then(hash => {
      userData.password = hash;

      return Bookshelf.transaction(t => {
        return User.forge()
          .save(userData, {transacting: t})
          .then(addedUser => {
            // TODO: Need to wait for Bookshelf to get relations right and refactor
            // this ugly manual crap
            return Profile.forge().save({user_id: addedUser.id}, {transacting: t});
          })
          .then(addedProfile => {
            t.commit;
            return addedProfile;
          })
          .catch(error => {
            t.rollback;
            console.error(error);
            return error;
          });
      });
    });
  }

  /**
   * check
   *
   * Finds the user by email and checks the password.
   *
   * @param {object} object
   */
  static check(data) {
    return this.getByEmail(data.email).then(user => {
      if (!user) {
        return Promise.reject(new Error('User not found.'));
      }

      return bcryptCompare(data.password, user.get('password')).then(matched => {
        if (!matched) {
          return Promise.reject(new Error('Invalid username or password.'));
        }
        return Promise.resolve(user);
      });
    })
  }

  /**
   * update
   *
   * Updates the user object.
   *
   * @param {object} data
   * @param {object} options
   */
  static update(data, options) {
  }

  /**
   * changePassword
   *
   * Finds the user by id and changes the user's password.
   *
   * @param {object} data
   * @param {object} options
   */
  static changePassword(data, options) {

  }

  static resetPassword(options) {

  }

  static generateResetToken(email, expires, hash) {

  }

  static validateToken(token, hash) {

  }

  /**
   * getByEmail
   *
   * Finds an user by email.
   *
   * @param {string} email
   * @param {object} options
   * @return {object} model
   */
  static getByEmail(email, options) {
    options = options || {};
    options.require = true;

    return User.forge({email: email.toLowerCase()}).fetch(options).then(user => {
      return user;
    })
    .catch(err => {
      console.error('User not found.');
    });
  }
}

export const Users = Bookshelf.Collection.extend({
  model: User
});

export default Bookshelf.model('User', User);
