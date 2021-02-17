exports.up = function(knex) {
    return knex.schema
    .table("artists", table => {
        table.string("firstname", 100);
        table.string("surname", 100);
        table.integer("age").unsigned();
        table.string("gender", 50);
        table.string("photoUrl", 255);
    })
};

exports.down = function(knex) {
    return knex.schema
        .table("artists", table => {
            table.dropColumns([
                "firstname",
                "surname",
                "age",
                "gender",
                "photoUrl"
            ]);
        })
};