exports.up = function(knex) {
    return knex.schema
    .table("artists", table => {
        table.string("firstname", 100)
        table.string("surname", 100)
        table.integer("age").unsigned();
        table.string("gender", 50);
        table.integer("songId").unsigned();
        table
            .foreign("songId")
            .references("songs.id")
            .onDelete("SET NULL")
        table.integer("albumId").unsigned();
        table
            .foreign("albumId")
            .references("albums.id")
            .onDelete("SET NULL")
    })
    .table("songs", table => {
        table.string("title", 100)
    })
    .table("albums", table => {
        table.string("title", 100)
    });
};

exports.down = function(knex) {
    return knex.schema
        .table("artists", table => {
            var foreignKeys = [
                "songId",
                "albumId"
            ];
            var otherFields = [
                "firstname",
                "surname",
                "age",
                "gender"
            ]

            foreignKeys.map(key => {
                table.dropForeign(key);
            });

            table.dropColumns([...foreignKeys, ...otherFields]);
        })
        .table("songs", table => {
            table.dropColumn("title");
        })
        .table("albums", table => {
            table.dropColumn("title");
        })
};