
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('sessions', function(t) {

    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('sessions')
  ]);
};
