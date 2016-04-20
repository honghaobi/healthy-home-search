
exports.up = function(knex, Promise) {
  return knex.schema.createTable('searches', function(table) {
    table.increments();
    table.string('user_id').notNullable();
    table.string('address').notNullable();
    table.string('community').notNullable();
    table.string('accessablility').notNullable();
    table.string('environment').notNullable();
    table.string('safety').notNullable();
    table.timestamp('date_time').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('searches')
};
