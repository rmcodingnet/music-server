exports.up = function(knex) {
    return knex.schema
    .table("albums", table => {
        table.string("description", 500);
    })
};

exports.down = function(knex) {
    return knex.schema
        .table("albums", table => {
            table.dropColumns([
                "description",
            ]);
        })
};