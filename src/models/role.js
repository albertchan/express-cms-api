import Bookshelf from './base';

export const schema = {
  id: { type: 'increments', nullable: false, primary: true },
  name: { type: 'string', maxlength: 255, nullable: false },
  description: { type: 'string', maxlength: 255, nullable: false }
};

export const Role = Bookshelf.Model.extend({
  tableName: 'roels',

  user() {
    return this.belongsToMany('User');
  }
}, {
  /**
   * permittedOptions
   *
   * Returns an array of keys permitted in a method's `options` hash, depending
   * on the current method.
   *
   * @param {String} methodName Name of the method to check valid options for
   * @return {Array} Keys allowed in the `options` hash of the model's method
   */
  permittedOptions(methodName) {
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
});

export const Roles = Bookshelf.Collection.extend({
  model: Role
});
