exports.up = function(knex, Promise) {
    return knex.schema.createTable('map_coords', function(table) {
        table.increments('id').primary();
        table.timestamps();
        table.text('coords', 'longtext');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('map_coords');
};
