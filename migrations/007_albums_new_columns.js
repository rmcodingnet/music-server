exports.up = function(knex) {
    return knex.schema
    .table("albums", table => {
        table.date("releaseDate");
        table.string("photoUrl", 255);
    })
};

exports.down = function(knex) {
    return knex.schema
        .table("albums", table => {
            table.dropColumns([
                "releaseDate",
                "photoUrl"
            ]);
        })
};