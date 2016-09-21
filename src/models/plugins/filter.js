export const filter = function(Bookshelf) {
  const Model = Bookshelf.Model.extend({
    // Cached copy of the filters setup for this model instance
    _filters: null,

    /**
     * fetchAndCombineFilters
     *
     * Helper method, uses combineFilters to apply filters to the current model
     * instance based on options and the set enforced/default filters for this
     * resource
     *
     * @param {Object} options
     * @returns {Bookshelf.Model}
     */
    fetchAndCombineFilters(options) {
      options = options || {};
      return this;
    },

    /**
     * applyDefaultAndCustomFilters
     *
     * This method makes the necessary query builder calls (through knex) for
     * the filters set on this model instance.
     * See http://bookshelfjs.org/#Model-instance-fetchPage
     *
     * @param {Object} options
     * @returns {Bookshelf.Model}
     */
    applyDefaultAndCustomFilters(options) {
      // TODO: implement query builder
      this.query(qb => {
        qb.where('id', '>', 0);

        if (options.filter) {
          const _filter = options.filter;
          qb.where(_filter.prop, _filter.op, _filter.value);
        }
      });

      return this;
    }
  });

  Bookshelf.Model = Model;
};
