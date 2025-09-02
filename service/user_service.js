require('dotenv').config();
const crypt = require('bcrypt');
const database = require('../util/database');
const jwt = require('jsonwebtoken');

const token = process.env.ACCESS_TOKEN;

const sign_up = async (data) => {
    // Payload req body from controller
    const {username, password} = data;

    // Check password have character < 6
    if (password.length < 6) {
        return {
            success: false,
            message: "Minimum password more than 6 character"
        }
    }

    // if password have more 6 character,system next prosess to query and check the username
    try {
        const exists = await database.query(`SELECT *
                                             FROM users
                                             WHERE username = $1`, [username]);
        if (exists.rows.length > 0) {
            return {
                success: false,
                message: "Username is already exists"
            };
        }
    } catch (err) {
        console.error("Error Internal" + err)
        throw new err;
    }

    // Check if username is match,then message user that username is already use in database


    // Hash password when username There isn't any in database
    const hashPassword = await crypt.hash(password, 10);

    // System process and create data and send to database
    const result = await database.query(`INSERT INTO users (username, password)
                                         VALUES ($1, $2) RETURNING id`, [username, hashPassword]);

    const userId = result.rows[0].id;
    const tokenJwt = generateToken({username});

    // Create session token to database
    await database.query(`INSERT INTO tokens (token, expired_at, userId)
                          VALUES ($1, $2, $3)`,
        [tokenJwt, new Date(Date.now() + 900000), userId]
    );

    return ({
        success: true,
        message: "User created successfully",
        Token: tokenJwt
    });
};

const sign_in = async (data) => {
    // Payload req body from controller

    const {username, password} = data;

    // Query to take data user with spesific username
    const rowUser = await database.query(`SELECT *
                                          FROM users
                                          WHERE username = $1`, [username]);

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

    console.log("password no hash " + password);
    console.log("password hash " + user.password);

    // If the password user when compare dosn't match,so return success false and message Password incorrect
    if (!isMatch) {
        return {
            success: false,
            message: "Password is incorrect"
        };
    }

    const jwtToken = generateToken({id: user.id, username: user.username});
    console.log("Username " + {username} + user.username);

    try {
        await database.query(
            `INSERT INTO tokens (token, expired_at, user_id)
             VALUES ($1, $2, $3)`,
            [jwtToken, new Date(Date.now() + 900000), user.id]
        );

        return ({
            success: true,
            message: "User signed in successfully",
            Token: jwtToken
        });
    } catch (err) {
        console.error("Internal server error " + err);
        throw new err;
    }

    // Debug for solve problem Internal server
    console.log("hasil jwt token " + jwtToken);

};

function generateToken(user) {
    return jwt.sign(
        {id: user.id, user: user.username},
        token,
        {expiresIn: '1800s'}
    );
}

module.exports = {
    sign_up,
    sign_in
}