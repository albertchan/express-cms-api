import _each from 'lodash/forEach';
import _intersection from 'lodash/intersection';
import _map from 'lodash/map';
import _pick from 'lodash/pick';
import _result from 'lodash/result';
import _union from 'lodash/union';
import bookshelf from 'bookshelf';
import moment from 'moment';
import db from '../../lib/db';
import { filter } from '../plugins';
import { schema } from '../index';
import { validateSchema } from '../../lib/validation';

// Initialize a new Bookshelf instance for reference elsewhere in app
let Bookshelf;
Bookshelf = bookshelf(db);

// Load the Bookshelf registry plugin, which helps us avoid circular dependencies
Bookshelf.plugin('registry');

// Load the Bookshelf pagination plugin for `fetchPage`
Bookshelf.plugin('pagination');

// Load the filter plugin, which handles applying a 'filter' to findPage requests
Bookshelf.plugin(filter);

Bookshelf.Model = Bookshelf.Model.extend({
  // get permitted attributes from model's schema
  permittedAttributes(tableName) {
  },

  // When loading an instance, subclasses can specify default to fetch
  defaultColumnsToFetch() {
    return [];
  },

  // Bookshelf `initialize`; declare a constructor-like method for model creation
  initialize() {
    this.on('saving', (model, attrs, options) => {
      return Promise.resolve(this.saving(model, attrs, options)).then(() => {
        return this.validate(model, attrs, options);
      });
    });
  },

  validate() {
    return validateSchema(this.tableName, this.toJSON());
  },

  saving(newObj, attr, options) {
    // empty
  },

  parse(attrs) {
    return this.formatDateWhenFetch(attrs);
  },

  // Fix date when retreiving from different databases (e.g. mysql, postgres)
  formatDateWhenFetch(attrs) {
    var self = this;

    _each(attrs, function each(value, key) {
      if (value !== null
        && (schema[self.tableName].hasOwnProperty(key)
        && schema[self.tableName][key].type === 'dateTime')
        || (key == 'created_at' || key == 'updated_at')) {
        attrs[key] = moment(value).toDate();
      }
    });
    return attrs;
  },

  // Normalize date format before inserting into database
  formatDateWhenSave(attrs) {

  }
}, {
  // Data utility functions

  /**
   * permittedOptions
   *
   * Returns an array of keys permitted in every method's `options` object.
   * Can be overridden and added to by a model's `permittedOptions` method.
   *
   * @return {Object} Keys allowed `options` of every model's method
   */
  permittedOptions() {
    // terms to whitelist for all methods.
    return ['context', 'include', 'transacting', 'importing'];
  },

  /**
   * filterData
   *
   * Filters potentially unsafe model attributes, so you can pass them to
   * Bookshelf/Knex.
   *
   * @param {Object} data     Keys representing the model's attributes
   * @return {Object} results The filtered results containing only what's allowed in the schema
   */
  filterData(data) {
    // TODO implement data sanitization
    const filteredData = data;
    return filteredData;
  },

  /**
   * filterOptions
   *
   * Filters potentially unsafe `options` in a model method's arguments, so you
   * can pass them to Bookshelf/Knex.
   *
   * @param {Object} options Represents options to filter in order to be passed to the Bookshelf query.
   * @param {String} methodName The name of the method to check valid options for.
   * @return {Object} The filtered results of `options`.
  */
  filterOptions(options, methodName) {
    const permittedOptions = this.permittedOptions(methodName);
    const filteredOptions = _pick(options, permittedOptions);

    return filteredOptions;
  },

  /**
   * findAll
   *
   * Fetches all the data for a particular model.
   *
   * @param {Object} options    (optional)
   * @return {Promise} results  <Collection>
   */
  findAll(options) {
    options = this.filterOptions(options, 'findAll');
    options.withRelated = _union(options.withRelated, options.include);

    const itemCollection = this.forge(null, {context: options.context});

    return itemCollection.fetchAll(options).then(result => {
      if (options.include) {

      }
    });
  },

  /**
   * findOne
   *
   * Find one model where data determines what to match on.
   *
   * @param {Object} options Represents options to filter in order to be passed to the Bookshelf query.
   * @param {String} methodName The name of the method to check valid options for.
   * @return {Promise} model Single model
  */
  findOne(data, options) {
    data = this.filterData(data);
    options = this.filterOptions(options, 'findOne');
    // pass `include` to forge so that toJSON has access
    return this.forge(data, {include: options.include}).fetch(options);
  },

  /**
   * findPage
   *
   * Find results by page - returns an object containing the information about
   * the request (page, limit), along with the data needed for
   * pagination (pages, total).
   *
   * Response:
   *  {
   *    items: [
   *      {...}, ...
   *    ],
   *    page: __,
   *    limit: __,
   *    pages: __,
   *    total: __
   *  }
   *
   * @param {Object} options
   */
  findPage(options) {
    options = options || {};

    const itemCollection = this.forge(null, {context: options.context});
    const tableName = _result(this.prototype, 'tableName');
    const requestedColumns = options.columns;

    // Filter options so that only permitted ones remain
    options = this.filterOptions(options, 'findPage');

    // TODO: handle related objects

    // Ensure only valid fields/columns are added to query
    // and append default columns to fetch
    if (options.columns) {
        options.columns = _intersection(options.columns, this.prototype.permittedAttributes());
        options.columns = _union(options.columns, this.prototype.defaultColumnsToFetch());
    }

    // Add Filter behaviour
    itemCollection.applyDefaultAndCustomFilters(options);

    // Handle related objects
    options.withRelated = _union(options.withRelated, options.include);

    return itemCollection.fetchPage(options).then(result => {
      let data = {};
      let models = [];

      options.columns = requestedColumns;
      models = result.toJSON();

      // re-add any computed properties that were stripped out before the call to fetchPage
      // pick only requested before returning JSON
      data[tableName] = _map(models, model => {
        return options.columns ? _pick(model, options.columns) : model;
      });
      data.meta = {pagination: result.pagination};

      return data;
    });
  },

  /**
   * add
   *
   * Naive add
   * @param {Object} data
   * @param {Object} options (optional)
   * @return {Promise(Bookshelf.Model)} Newly Added Model
   */
  add(data, options) {
    data = this.filterData(data);
    options = this.filterOptions(options, 'add');
    const model = this.forge(data);

    return model.save(null, options);
  },

  /**
   * update
   *
   * Naive update
   * @param {Object} id (required)
   * @param {Object} data
   * @param {Object} options (optional)
   * @return {Promise(Bookshelf.Model)} Edited Model
   */
  update(id, data, options) {
    // const id = options.id;
    const model = this.forge(id);

    data = this.filterData(data);
    options = this.filterOptions(options, 'edit');

    return model.fetch(options).then(object => {
      if (object) {
        return object.save(data, options);
      }
    });
  }
});

export default Bookshelf;
module.exports = Bookshelf;
