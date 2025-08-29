const database = require('../util/server');

const sign_up = async (data) => {
    const { username, password } = data;

    const [exists] = await database.query(`SELECT FROM users WHERE username = ?`, [username]);

    if (exists.legth > 0) {
        return {
            success: false,
            message: "Username is already exists"
        };
    }

    const query = await database.query(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password]);
    return database.query(
        query,
        [username, password],
        {
            success: true,
            message: "User created successfully"
        });
};

const sign_in = async (data) => {
    const { username, password } = data;

    const [exists] = await database.query(`SELECT FROM users WHERE password = ?`, [password]);

    if (password !== exists[0].password) {
        return {
            success: false,
            message: "Password is incorrect"
        };
    }

    const query = await database.query(`SELECT * FROM users WHERE username = ? AND password = ?`);
    return database.query(
        query,
        [username, password],
        {
            success : true,
            message : "User signed in successfully" 
        });
};

module.exports = {
    sign_up,
    sign_in
}