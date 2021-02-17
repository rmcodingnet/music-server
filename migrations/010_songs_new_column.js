const e = require("express");

exports.up = function(knex) {
    return knex.schema
    .table("songs", table => {
        table.integer("trackNo").unsigned();
    })
};

exports.down = function(knex) {
    return knex.schema
    .table("songs", table => {
        table.dropColumns([
            "trackNo"
        ]);
    })
};