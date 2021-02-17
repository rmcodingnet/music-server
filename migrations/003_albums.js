exports.up = function(knex) {
    return knex.schema
    .table("albums", table => {
        table.string("title", 100);
        table.date("releaseDate");
        table.string("photoUrl", 255);
        table.integer("artistId").unsigned();
        table
            .foreign("artistId")
            .references("artists.id")
            .onDelete("SET NULL");
    })
};

exports.down = function(knex) {
    return knex.schema
        .table("albums", table => {
            table.dropForeign("artistId");
            table.dropColumns([
                "title",
                "artistId",
                "releaseDate",
                "photoUrl"
            ]);
        })
};