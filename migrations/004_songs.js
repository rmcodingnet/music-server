const e = require("express");

exports.up = function(knex) {
    return knex.schema
    .table("songs", table => {
        table.string("title", 100)
        table.time("length")
        table.integer("albumId").unsigned();
        table
            .foreign("albumId")
            .references("albums.id")
            .onDelete("SET NULL")
        table.integer("artistId").unsigned();
        table
            .foreign("artistId")
            .references("artists.id")
            .onDelete("SET NULL")
    })
};

exports.down = function(knex) {
    return knex.schema
    .table("songs", table => {
        var foreignKeys = [
            "albumId",
            "artistId"
        ];
        var otherFields = [
            "title",
            "length"
        ]

        foreignKeys.map(key => {
            table.dropForeign(key);
        });

        table.dropColumns([...foreignKeys, ...otherFields]);
    })
};