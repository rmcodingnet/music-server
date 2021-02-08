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

        return knex("songs")
            .select(
                "songs.id",
                "songs.title",
                "songs.length",
                "albums.title as albumTitle",
                "artists.firstname",
                "artists.surname"
            )
            .leftJoin(
                "albums",
                "albums.id",
                "songs.albumId"
            )
            .leftJoin(
                "artists",
                "artists.id",
                "songs.artistId"
            )
            .orderBy("songs.createdAt", "desc")
            .then(result => { return res.json(result) })
    }
)

router.get(
    "/:songID",
    [param("songID").isInt().toInt()],
    async (req, res) => {
        try {
            const { songID } = matchedData(req);
            var songQuery = knex("songs")
                .select(
                    "songs.id",
                    "songs.title",
                    "songs.length",
                    "albums.title as albumTitle",
                    "artists.firstname",
                    "artists.surname"
                )
                .leftJoin(
                    "albums",
                    "albums.id",
                    "songs.albumId"
                )
                .leftJoin(
                    "artists",
                    "artists.id",
                    "songs.artistId"
                )
                .where("songs.id", songID)
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
        body("length"),
        body("albumId"),
        body("artistId")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const data = matchedData(req, { includeOptionals: true });
        console.log(req.body, "body")
        knex("songs")
            .insert({
                title: data.title,
                length: data.length,
                albumId: data.albumId,
                artistId: data.artistId,
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
        body("length"),
        body("albumId"),
        body("artistId")

    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const data = matchedData(req, { includeOptionals: true });

        knex("songs")
            .update({
                title: data.title,
                length: data.length,
                albumId: data.albumId,
                artistId: data.artistId,
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

    knex("songs")
        .where({
            id: ID,
        })
        .del()
        .then((value) => {
            if (value > 0) {
                return res.send("SONG DELETED");
            }
            return res.status(404).send("SONG NOT FOUND");
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
});

module.exports = router;