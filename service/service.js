const crypt = require('bcrypt');
const database = require('../util/database');

const sign_up = async (data) => {
    const { username, password } = data;

    if(password.length < 6){
        return {
            success: false,
            message: "Minimum password more than 6 character"
        }
    }

    const exists = await database.query(`SELECT * FROM users WHERE username = $1`, [username]);

    if (exists.rows.length > 0) {
        return {
            success: false,
            message: "Username is already exists"
        };
    }

    const hashPassword = await crypt.hash(password, 10);

    const result = await database.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [username, hashPassword]);

    return ({
            success: true,
            message: "User created successfully"
    });
};

const sign_in = async (data) => {
    const { username, password } = data;

    const exists = await database.query(`SELECT * FROM users WHERE username = $1`, [username]);

    if (exists.rows.length === 0) {
        return {
            success: false,
            message: "Password or username is incorrect"
        };
    }

    const user = exists.rows[0];
    const isMatch = await crypt.compare(password, user.password);
    
    if (!isMatch) {
        return {
            success: false,
            message: "Password or username is incorrect"
        };
    }
    return ({
            success : true,
            message : "User signed in successfully" 
    });
};

module.exports = {
    sign_up,
    sign_in
}