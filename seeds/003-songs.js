const songsData = require("./data/songs.json");

exports.seed = async function(knex) {
    return knex("songs")
        .del()
        .then(async function() {
            var id = 1;

            var songs = songsData.map(songData => {
                var newId = id++

                return {
                    id: newId,
                    title: songData["title"],
                    length: songData["length"],
                    albumId: songData["albumId"],
                    artistId: songData["artistId"],
                    rating: songData["rating"]
                }
            });

            var res = await knex("songs").insert(songs)

            return true 
        });
};