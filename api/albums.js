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

        return knex("albums")
            .select(
                "albums.id",
                "albums.title",
                "albums.releaseDate",
                "albums.photoUrl",
                "artists.firstname",
                "artists.surname"
            )
            .leftJoin(
                "artists",
                "artists.id",
                "albums.artistId"
            )
            .orderBy("albums.createdAt", "desc")
            .then(result => { return res.json(result) })
    }
)

router.get(
    "/:albumID",
    [param("albumID").isInt().toInt()],
    async (req, res) => {
        try {
            const { albumID } = matchedData(req);
            var albumQuery = knex("albums")
                .select(
                    "albums.id",
                    "albums.title",
                    "albums.releaseDate",
                    "albums.photoUrl",
                    "artists.firstname",
                    "artists.surname"
                )
                .leftJoin(
                    "artists",
                    "artists.id",
                    "albums.artistId"
                )
                .where("albums.id", albumID)
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
        body("title"),
        body("artistId"),
        body("releaseDate"),
        body("photoUrl"),
        body("description")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const data = matchedData(req, { includeOptionals: true });
        console.log(req.body, "body")
        knex("albums")
            .insert({
                title: data.title,
                artistId: data.artistId,
                releaseDate: data.releaseDate,
                photoUrl: data.photoUrl,
                description: data.description,
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
        body("title"),
        body("artistId"),
        body("releaseDate"),
        body("photoUrl")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const data = matchedData(req, { includeOptionals: true });

        knex("albums")
            .update({
                title: data.title,
                artistId: data.artistId,
                releaseDate: data.releaseDate,
                photoUrl: data.photoUrl,
                description: data.description,
                updatedAt: new Date()
            })
            .where("id", data.ID)
            .then((result) => {
                if (result > 0) {
                    return res.send("ALBUM UPDATED");
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

    knex("albums")
        .where({
            id: ID,
        })
        .del()
        .then((value) => {
            if (value > 0) {
                return res.send("ALBUM DELETED");
            }
            return res.status(404).send("ALBUM NOT FOUND");
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
});

module.exports = router;