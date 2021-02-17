exports.up = function(knex) {
    return knex.schema
    .table("collaborators", table => {
        table.string("name", 100);
       
        table.integer("songId").unsigned();
        table
            .foreign("songId")
            .references("songs.id")
            .onDelete("SET NULL");
    })
};

exports.down = function(knex) {
    return knex.schema
        .table("collaborators", table => {
            table.dropForeign("songId");
            table.dropColumns([
                "name",
                "songId",
            ]);
        })
};