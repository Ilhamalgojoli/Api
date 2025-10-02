require('dotenv').config();
const crypt = require('bcrypt');
const database = require('../util/database');
const jwt = require('jsonwebtoken');

const postProfile = async (data) => {
    try {
        const { path_profile, image } = data;
        const query = await database.query(`INSERT INTO users (image_path) VALUES($1)`, [path_profile]);

        if( query.rowCount === 0){
            return ({
                success: false,
                message: "Bad request"
            });
        }

        return ({
            success: true,
            message: "Success send to server"
        });
    } catch (err) {
        return ({
            success: false,
            message: "Internal server down"
        })
    }
}

const getProfile = async (id) => {
    try {
        console.log("Data id nya : " + id);

        const query = await database.query(`SELECT username FROM users WHERE id = $1`, [id]);

        if (query.rows.length === 0){
            return ({
                success: false,
                message: "Id not found"
            });
        }

        return query.rows[0] ;
    } catch(err){
        return ({
            success: false ,
            message: `Internal server down : ${err}`
        });
    }
}

module.exports = {
    postProfile,
    getProfile
}