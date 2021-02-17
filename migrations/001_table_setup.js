exports.up = function(knex) {
    return knex.schema
        .createTable("artists", table => {
            table.increments("id");
            table.datetime("createdAt").defaultTo(knex.fn.now());
            table.datetime("updatedAt").defaultTo(knex.fn.now());
        })
        .createTable("albums", table => {
            table.increments("id");
            table.datetime("createdAt").defaultTo(knex.fn.now());
            table.datetime("updatedAt").defaultTo(knex.fn.now());
        })
        .createTable("songs", table => {
            table.increments("id");
            table.datetime("createdAt").defaultTo(knex.fn.now());
            table.datetime("updatedAt").defaultTo(knex.fn.now());
        })
        .createTable("collaborators", table => {
            table.increments("id");
            table.datetime("createdAt").defaultTo(knex.fn.now());
            table.datetime("updatedAt").defaultTo(knex.fn.now());
        })
}

exports.down = function(knex) {
    return knex.schema
        .dropTable("artists")
        .dropTable("albums")
        .dropTable("songs")
        .dropTable("collaborators")
}