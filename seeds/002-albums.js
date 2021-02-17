const albumsData = require("./data/albums.json");

exports.seed = async function(knex) {
    return knex("albums")
        .del()
        .then(async function() {
            var id = 1;

            var albums = albumsData.map(albumData => {
                var newId = id++

                return {
                    id: newId,
                    title: albumData["title"],
                    artistId: albumData["artistId"],
                    releaseDate: albumData["releaseDate"],
                    photoUrl: albumData["photoUrl"]
                }
            });

            var res = await knex("albums").insert(albums)

            return true 
        });
};
