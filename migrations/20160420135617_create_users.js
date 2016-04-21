
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('full_name');
    table.string('email');
    table.string('password_digest');
    table.boolean('isGoogle').notNullable().defaultTo(false);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
