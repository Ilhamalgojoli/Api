require('dotenv').config();
const crypt = require('bcrypt');
const database = require('../util/database');
const jwt = require('jsonwebtoken');

let token = process.env.TOKEN;

const sign_up = async (data) => {
    // Payload req body from controller
    const { username, password } = data;

    // Check password have character < 6
    if(password.length < 6){
        return {
            success: false,
            message: "Minimum password more than 6 character"
        }
    }

    // if password have more 6 character,system next prosess to query and check the username
    const exists = await database.query(`SELECT * FROM users WHERE username = $1`, [username]);

    // Check if username is match,then message user that username is already use in database
    if (exists.rows.length > 0) {
        return {
            success: false,
            message: "Username is already exists"
        };
    }

    // Hash password when username There isn't any in database
    const hashPassword = await crypt.hash(password, 10);

    // System process and create data and send to database
    await database.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [username, hashPassword]);

    return ({
            success: true,
            message: "User created successfully"
    });
};

const sign_in = async (data) => {
    // Payload req body from controller

    const { username, password } = data;

    // Query to take data user with spesific username
    const rowUser = await database.query(`SELECT * FROM users WHERE username = $1`, [username]);

    // If data user is not match,then make sure that username is correct, cause when the check,system check the username
    if (rowUser.rows.length === 0) {
        return {
            success: false,
            message: "Username is incorrect"
        };
    }

    const user = rowUser.rows[0];
    const isMatch = await crypt.compare(password, user.password);

    // Debug for solve problem Internal server

    // console.log("password no hash " + password);
    // console.log("password hash " + user.password);

    // If the password user when compare dosn't match,so return success false and message Password incorrect
    if (!isMatch) {
        return {
            success: false,
            message: "Password is incorrect"
        };
    }

    const jwtToken = generateToken({ username } );

    // Debug for solve problem Internal server

    // console.log("hasil jwt token " + jwtToken);
    return ({
            success : true,
            message : "User signed in successfully",
            Token : jwtToken
    });
};

function generateToken(username){
    return jwt.sign(username, token, { expiresIn: '1800s' })
}

module.exports = {
    sign_up,
    sign_in
}