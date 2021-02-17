const collaboratorsData = require("./data/collaborators.json");

exports.seed = async function(knex) {
    return knex("collaborators")
        .del()
        .then(async function() {
            var id = 1;

            var collaborators = collaboratorsData.map(collabData => {
                var newId = id++

                return {
                    id: newId,
                    name: collabData["name"],
                    songId: collabData["songId"]
                }
            });

            var res = await knex("collaborators").insert(collaborators)

            return true 
        });
};
