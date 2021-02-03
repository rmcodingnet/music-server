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
    .table("albums", table => {
        table.string("title", 100)
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
    .table("albums", table => {
        table.dropColumn("title");
    })
    .table("artists", table => {
        table.dropColumns([
            "firstname",
            "surname"
        ])
    })
};