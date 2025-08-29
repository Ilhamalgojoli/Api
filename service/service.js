const database = require('../util/server');

const sign_up = async((data) => {
    const { username, password } = data ;
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    return database.query(query, [username, password]); 
});

const sign_in = async((data) => {
    const { username, password } = data ;
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    return database.query(query, [username, password]);
});
