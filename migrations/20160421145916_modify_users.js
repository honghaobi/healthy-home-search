
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('isGoogle');
    table.dropColumn('email');
  }).then(() => {
    return knex.schema.table('users', function(table) {
      table.string('google_id');
      table.string('email').unique();
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('isGoogle');
    table.dropColumn('email');
  }).then(() => {
    return knex.schema.table('users', function(table) {
      table.boolean('isGoogle').notNullable();
      table.string('email');
    });
  });
};
