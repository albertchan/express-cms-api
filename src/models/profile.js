import Bookshelf from './base';

export const schema = {
  id: { type: 'increments', nullable: false, primary: true },
  user_id: { type: 'integer', nullable: false, unsigned: true, references: 'users.id' },
  address1: { type: 'string', maxlength: 255, nullable: true },
  address2: { type: 'string', maxlength: 255, nullable: true },
  city: { type: 'string', maxlength: 255, nullable: true },
  state_code: { type: 'string', maxlength: 8, nullable: true },
  country_code: { type: 'string', maxlength: 8, nullable: true },
  zip_code: { type: 'string', maxlength: 32, nullable: true },
  tel_number: { type: 'string', maxlength: 32, nullable: true },
  avatar_url: { type: 'string', maxlength: 255, nullable: true, validations: { isURL: true }},
  bio: { type: 'text', maxlength: 65535, nullable: true },
  timestamps: { type: 'timestamps' }
};

export class Profile extends Bookshelf.Model {
  get tableName() {
    return 'profiles';
  }

  user() {
    return this.belongsTo('User', 'user_id');
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
      findOne: ['withRelated'],
      findAll: ['withRelated']
    };

    if (validOptions[methodName]) {
      options = options.concat(validOptions[methodName]);
    }

    return options;
  }

  /**
   * update
   *
   * Updates the profile object.
   *
   * @param {object} data
   * @param {object} options
   */
  static update(data, options) {
    const profileData = data;
    // delete data.profile;
    // const userData = data;

    console.log('profileData', profileData);
    // console.log('userData', userData);

    // return Bookshelf.transaction(t => {
    //   return Profile.forge({user_id: validator.toInt(data.id)})
    //     .save(userData, {transacting: t})
    //     .then(addedUser => {
    //       // TODO: Need to wait for Bookshelf to get relations right and refactor
    //       // this ugly manual crap
    //       return Profile.forge().save({user_id: addedUser.id}, {transacting: t});
    //     })
    //     .then(addedProfile => {
    //       t.commit;
    //       return addedProfile;
    //     })
    //     .catch(error => {
    //       t.rollback;
    //       console.error(error);
    //       return error;
    //     });
    // });
  }
}

export default Bookshelf.model('Profile', Profile);
