exports.up = function(knex) {
    return knex.schema
    .table("albums", table => {
        table.string("title", 100)
        table.integer("artistId").unsigned();
        table
            .foreign("artistId")
            .references("artists.id")
            .onDelete("SET NULL")
    })
    .table("artists", table => {
        table.string("firstname", 100)
        table.string("surname", 100)
        //Was going to use these to fields to 
        //concat together a "name" field if that's possible
    })
};

exports.down = function(knex) {
    return knex.schema
        .table("albums", table => {
            table.dropForeign("artistId");
            table.dropColumns([
                "title",
                "artistId"
            ]);
        })
        .table("artists", table => {
            table.dropColumns([
                "firstname",
                "surname"
            ])
        })
};