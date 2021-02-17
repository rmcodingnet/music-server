const express = require("express");

const {
    query,
    validationResult,
    matchedData,
    param,
    body,
} = require("express-validator");

const knex = require("../db/knex")

const router = express.Router();

router.get(
    "/",
    [],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        return knex("collaborators")
            .select(
                "collaborators.id",
                "collaborators.name",
                "songs.title",
            )
            .leftJoin(
                "songs",
                "songs.id",
                "collaborators.songId"
            )
            .orderBy("collaborators.createdAt", "desc")
            .then(result => { return res.json(result) })
    }
)

router.get(
    "/:collabID",
    [param("collabID").isInt().toInt()],
    async (req, res) => {
        try {
            const { collabID } = matchedData(req);
            var albumQuery = knex("collaborators")
                .select(
                    "collaborators.id",
                    "collaborators.name",
                    "songs.title",
                )
                .leftJoin(
                    "songs",
                    "songs.id",
                    "collaborators.songId"
                )
                .where("collaborators.id", collabID)
                .first()
                .then((result) => {
                    return res.json(result);
                })
                .catch((error) => {
                    console.log(error);
                    return res.status(500).send("Error");
                })
        } catch (error) {
            console.log(error);
            return res.status(500).send("Error")
        }
    }
)

router.post(
    "/",
    [
        body("name"),
        body("songId")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const data = matchedData(req, { includeOptionals: true });
        console.log(req.body, "body")
        knex("collaborators")
            .insert({
                name: data.name,
                songId: data.songId,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .then(([newID]) => {
                return res.json({ newID });
            })
            .catch((err) => {
                return res.status(500).send(err)
            });
    }
);

router.post(
    "/:ID",
    [
        param("ID"),
        body("name"),
        body("songId")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const data = matchedData(req, { includeOptionals: true });

        knex("collaborators")
            .update({
                name: data.name,
                songId: data.songId,
                updatedAt: new Date()
            })
            .where("id", data.ID)
            .then((result) => {
                if (result > 0) {
                    return res.send("COLLABORATOR UPDATED");
                }
                return res.status(404).send("Not found");
            })
            .catch((err) => {
                return res.status(500).send(err)
            })
    }


)

router.delete("/:ID", [param("ID").isInt().toInt()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { ID } = matchedData(req, { includeOptionals: true });

    knex("collaborators")
        .where({
            id: ID,
        })
        .del()
        .then((value) => {
            if (value > 0) {
                return res.send("COLLABORATOR DELETED");
            }
            return res.status(404).send("COLLABORATOR NOT FOUND");
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
});

module.exports = router;