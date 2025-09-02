const database = require('../util/database');
var session = require('express-session');

const addCollection = async (data) => {
    const {title, poster_path, movie_id} = data
    const userId = req.session.user_id;

    try {
        const req_coll = await database.query(
            `INSERT INTO my_collection (name, path, id_coll, user_id)
             VALUES ($1, $2, $3, $4)`,
            [title, poster_path, movie_id, userId]
        );

        if (!req_coll) {
            return ({
                success: false,
                message: "Failed to add collection"
            });
        }
    } catch (err) {
        console.error(err);
        throw new err;
    }

    return ({
        success: true,
        message: "Success add collection"
    });
}