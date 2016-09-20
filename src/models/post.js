import _toString from 'lodash/toString';
import _union from 'lodash/union';
import uuid from 'node-uuid';
import Bookshelf from './base';

export const schema = {
  id: { type: 'increments', nullable: false, primary: true },
  user_id: { type: 'integer', nullable: false, unsigned: true, references: 'users.id' },
  uuid: { type: 'string', maxlength: 36, nullable: false, validations: { isUUID: true }},
  language: { type: 'string', maxlength: 6, nullable: false, defaultTo: 'en-US' },
  status: { type: 'string', maxlength: 150, nullable: false, defaultTo: 'draft' },
  visibility: { type: 'string', maxlength: 150, nullable: false, defaultTo: 'public' },
  slug: { type: 'string', maxlength: 150, nullable: false, unique: true },
  title: { type: 'string', maxlength: 255, nullable: false },
  lead_image: { type: 'string', maxlength: 255, nullable: true, validations: { isURL: true }},
  markdown: { type: 'text', maxlength: 16777215, nullable: true },
  summary: { type: 'string', maxlength: 255, nullable: true },
  featured: { type: 'bool', nullable: false, defaultTo: false },
  published_at: { type: 'dateTime', nullable: true, defaultTo: null, validations: { isDate: true }},
  timestamps: { type: 'timestamps' }
}

export class Post extends Bookshelf.Model {
  get tableName() {
    return 'posts';
  }

  get hasTimestamps() {
    return true;
  }

  // Relations
  user() {
    return this.belongsTo('User', 'user_id');
  }

  // Events
  saving(model, attr, options) {
    let markdown;
    let publishedAt = this.get('published_at');
    // let status = this.get('status');
    let title = 'Untitled';
    let tags = [];

    this.set('uuid', uuid.v4());

    title = this.get('title') || title;
    this.set('title', _toString(title).trim());

    // logic for published_at
    if (!publishedAt) {
      this.set('published_at', new Date());
    }

    Bookshelf.Model.prototype.saving.call(this, model, attr, options);
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
      findOne: ['columns', 'importing', 'withRelated', 'require'],
      findPage: ['page', 'limit', 'columns', 'filter', 'order', 'status', 'staticPages'],
      findAll: ['columns', 'filter']
    };

    if (validOptions[methodName]) {
      options = options.concat(validOptions[methodName]);
    }

    return options;
  }

  /**
   * add
   *
   * @extends Bookshelf.Model.add to handle returning the full object
   * **See:** [Bookshelf.Model.add](base.js.html#add)
   */
  static add(data, options) {
    options = options || {};

    return Bookshelf.Model.add.call(this, data, options).then(post => {
      return post;
    });
  }

  /**
   * update
   *
   * @extends Bookshelf.Model.update to handle returning the full object and manage _updatedAttributes
   * **See:** [Bookshelf.Model.update](base.js.html#update)
   */
  update(id, data, options) {
    options = options || {};

    return Bookshelf.Model.update.call(this, id, data, options).then(post => {
      return self.findOne({status: 'all', id: options.id}, options).then(found => {
        if (found) {
          // Pass along the updated attributes for checking status changes
          found._updatedAttributes = post._updatedAttributes;
          return found;
        }
      });
    });
  }

  /**
   * findOne
   *
   * @extends Bookshelf.Model.findOne to include user/author
   */
  static findOne(data, options) {
    options = options || {};
    options.withRelated = _union(options.withRelated, ['user']);

    return this.forge(data).fetch(options);
  }
}

export const Posts = Bookshelf.Collection.extend({
  model: Post
});

export default Bookshelf.model('Post', Post);
