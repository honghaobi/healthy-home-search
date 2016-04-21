
exports.up = function(knex, Promise) {
  return knex.schema.table('searches', function(table) {
    table.dropColumn('user_id');
  }).then(() => {
    return knex.schema.table('searches', function(table) {
      table.integer('user_id').notNullable();
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('searches', function(table) {
    table.dropColumn('user_id');
  }).then(() => {
    return knex.schema.table('searches', function(table) {
      table.string('user_id').notNullable();
    });
  });
};
