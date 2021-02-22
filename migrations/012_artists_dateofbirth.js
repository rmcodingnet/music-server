exports.up = function(knex) {
    return knex.schema
    .table("artists", table => {
        table.date("birthDate");
    })
};

exports.down = function(knex) {
    return knex.schema
        .table("artists", table => {
            table.dropColumns([
                "birthDate"
            ]);
        })
};