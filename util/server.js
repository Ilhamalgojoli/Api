require('dotenv').config();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if(err){
        console.error("Database connection failed !!!", err);
    }
    else {
        console.log("Database connected!");
    }
});

module.exports = connection;