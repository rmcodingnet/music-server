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
                "artists.id as artistId",
                "artists.firstname",
                "artists.surname",
                "artists.age",
                "collaborators.name as collaborators",
                "albums.id as albumId",
                "albums.title as albumTitle",
                "albums.releaseDate",
                "songs.length",      
                knex.raw("GROUP_CONCAT(collaborators.name) as?", ["collaborators"])          
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
            .rightJoin(
                "collaborators",
                "songs.id",
                "collaborators.songId"
            )
            .orderBy("songs.createdAt", "desc")
            
            .groupBy("songs.id")
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
                    "songs.rating",
                    "albums.title as albumTitle",
                    "artists.firstname",
                    "artists.surname",
                    "collaborators.name",
                    knex.raw("GROUP_CONCAT(collaborators.name) as?", ["collaborators"])          

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
                .rightJoin(
                    "collaborators",
                    "songs.id",
                    "collaborators.songId"
                )
                .where("songs.id", songID)
                .first()
                .groupBy("songs.id")
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
//artist header info
router.get(
    "/artistinfo/:artistID",
    [param("artistID").isInt().toInt()],
    async (req, res) => {
        try {
            const { artistID } = matchedData(req);
            var songQuery = knex("songs")
                .select(
                    "songs.id",
                    "artists.photoUrl",
                    "artists.firstname",
                    "artists.surname", 
                    "artists.age",
                    knex.raw("GROUP_CONCAT(songs.title) as?", ["songs"]),  
                    knex.raw("GROUP_CONCAT(DISTINCT albums.title) as?", ["albums"])
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
                .where("songs.artistId", artistID)
                .groupBy("songs.artistId")
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





//top rated song list
router.get(
    "/artist/:artistID",
    [param("artistID").isInt().toInt()],
    async (req, res) => {
        try {
            const { artistID } = matchedData(req);
            console.log("artistID =")
            console.dir(artistID)
            var songQuery = knex("songs")
                .select(
                    "songs.id",
                    "songs.title",
                    "songs.length",
                    "songs.rating",
                    "albums.photoUrl"

                )
                .leftJoin(
                    "albums",
                    "albums.id",
                    "songs.albumId"
                )
                .where("songs.artistId", artistID)
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
//discography
router.get(
    "/discog/:artistID",
    [param("artistID").isInt().toInt()],
    async (req, res) => {
        try {
            const { artistID } = matchedData(req);
            var songQuery = knex("songs")
                .select(
                    "songs.id",
                    "songs.length",
                    "albums.title as albumTitle",
                    "albums.photoUrl",
                    knex.raw("GROUP_CONCAT(songs.title) as?", ["songs"]),  
                    knex.raw("GROUP_CONCAT(songs.length) as?", ["songLengths"])
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
                .where("songs.artistId", artistID)
                .groupBy("songs.albumId")
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

//album header details
router.get(
    "/albums/:albumID",
    [param("albumID").isInt().toInt()],
    async (req, res) => {
        try {
            const { albumID } = matchedData(req);
            var songQuery = knex("songs")
                .select(
                    "albums.id as albumId",
                    "songs.length",
                    "albums.title as albumTitle",
                    "albums.description",
                    "albums.photoUrl",
                    "artists.firstname",
                    "artists.surname",
                    "songs.artistId as artistId",
                    knex.raw("GROUP_CONCAT(songs.length) as?", ["songLengths"]),
                    knex.raw("GROUP_CONCAT( DISTINCT collaborators.name) as?", ["collaborators"])    
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
                .rightJoin(
                    "collaborators",
                    "songs.id",
                    "collaborators.songId"
                )
                .where("albums.id", albumID)
                .groupBy("albums.id")
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

//album songs 

router.get(
    "/albumsongs/:albumID",
    [param("albumID").isInt().toInt()],
    async (req, res) => {
        try {
            const { albumID } = matchedData(req);
            var songQuery = knex("songs")
                .select(
                    "songs.trackNo",
                    "songs.title",
                    "collaborators.name",
                    "songs.length",
                    
                )
                .rightJoin(
                    "collaborators",
                    "songs.id",
                    "collaborators.songId"
                )
                .where("songs.albumId", albumID)
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
        body("artistId"),
        body("rating")
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
                rating: data.rating,
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
        body("artistId"),
        body("rating")

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
                rating: data.rating,
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