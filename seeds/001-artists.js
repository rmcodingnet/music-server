const artistsData = require("./data/artists.json");

exports.seed = async function(knex) {
    return knex("artists")
        .del()
        .then(async function() {
            var id = 1;

            var artists = artistsData.map(artistData => {
                var newId = id++

                return {
                    id: newId,
                    firstname: artistData["firstname"],
                    surname: artistData["surname"],
                    age: artistData["age"],
                    gender: artistData["gender"]
                }
            });

            var res = await knex("artists").insert(artists)

            return true 
        });
};