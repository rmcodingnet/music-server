exports.up = function(knex) {
    return knex.schema
    .table("artists", table => {
        table.string("photoUrl", 255);
    })
};

exports.down = function(knex) {
    return knex.schema
        .table("artists", table => {
            table.dropColumns([
                "photoUrl"
            ]);
        })
};