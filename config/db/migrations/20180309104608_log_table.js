
exports.up = function(knex, Promise) {
    return knex.schema.createTable('logs', function(table) {
        table.increments('id').primary();
        table.timestamps();
        table.string('log');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('logs');
};
