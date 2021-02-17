const e = require("express");

exports.up = function(knex) {
    return knex.schema
    .table("songs", table => {
        table.integer("rating").unsigned();
    })
};

exports.down = function(knex) {
    return knex.schema
    .table("songs", table => {
        table.dropColumns([
            "rating"
        ]);
    })
};