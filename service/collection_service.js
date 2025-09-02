const database = require('../util/database');

const addCollection = async (data) => {
    try {
        const { title, poster_path, coll_id, userId } = data;

        // Query to send data
        const req_coll = await database.query(
            `INSERT INTO my_collection (name, path, id_coll, user_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, poster_path, coll_id, userId]
        );

        console.log("Nama: " + title);
        console.log("Poster: " + poster_path);
        console.log("Id: " + coll_id);
        console.log("User id: " + userId);

        if (req_coll.rowCount === 0) {
            return ({
                success: false,
                message: "Bad request"
            });
        }

        console.log({title, poster_path, coll_id, userId});
        console.log(data);

        return ({
            success: true,
            message: "Success add collection"
        });
    } catch (err) {
        return ({
            success: false,
            message: err
        },err);
    }
}

module.exports = {
    addCollection
}