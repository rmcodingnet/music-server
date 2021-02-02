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
    "/music/artists/",
    [],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        return knex("artists")
            .select(
                "artists.id",
                "artists.firstname",
                "artists.surname",
                "artists.age",
                "artists.gender",
                "songs.title",
                "albums.title"
            )
            .leftJoin(
                "songs",
                "songs.id",
                "artists.songId"
            )
            .leftJoin(
                "albums",
                "albums.id",
                "artists.albumId"
            )
            .orderBy("artists.createdAt", "desc")
            .then(result => { return res.json(result) })
    }
)

router.get(
    "/music/artists/:artistID",
    [param("artistID").isInt().toInt()],
    async (req, res) => {
        try {
            const { artistID } = matchedData(req);
            var artistQuery = knex("artists")
                .select(
                    "artists.id",
                    "artists.firstname",
                    "artists.surname",
                    "artists.age",
                    "artists.gender",
                    "songs.title",
                    "albums.title"
                )
                .leftJoin(
                    "songs",
                    "songs.id",
                    "artists.songId"
                )
                .leftJoin(
                    "albums",
                    "albums.id",
                    "artists.albumId"
                )
                .where("artists.id", artistID)
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
    "/music/artists/",
    [
        body("firstname"),
        body("surname"),
        body("age"),
        body("gender"),
        body("songId"),
        body("albumId")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const data = matchedData(req, { includeOptionals: true });
        console.log(req.body, "body")
        knex("artists")
            .insert({
                firstname: data.firstname,
                surname: data.surname,
                age: data.age,
                gender: data.gender,
                songId: data.songId,
                albumId: data.albumId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .then(([newId]) => {
                return res.json({ newID });
            })
            .catch((err) => {
                return res.status(500).send(err)
            });
    }
);

router.post(
    "/music/artists/:ID",
    [
        param("ID"),
        body("firstname"),
        body("surname"),
        body("age"),
        body("gender"),
        body("songId"),
        body("albumId")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const data = matchedData(req, { includeOptionals: true });

        knex("artists")
         .update({
             firstname: data.firstname, 
             surname: data.surname,
             age: data.age,
             gender: data.gender, 
             songId: data.songId,
             albumId: data.albumId,
             updatedAt: new Date(),
         })
         .where("id", data.ID)
         .then((result) => {
             if (result > 0) {
                 return res.send("ARTIST UPDATED");
             }
             return res.status(404).send("Not found");
         })
        .catch((err) => {
            return res.status(500).send(err)
        })
    }

    
)

router.delete("/music/artists/:ID", [param("ID").isInt().toInt()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    const { ID } = matchedData(req, { includeOptionals: true });
  
    knex("artists")
      .where({
        id: ID,
      })
      .del()
      .then((value) => {
        if (value > 0) {
          return res.send("ARTIST DELETED");
        }
        return res.status(404).send("PRODUCT NOT FOUND");
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  });
  
  module.exports = router;