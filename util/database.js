require('dotenv').config();

const { pool } = new Pool({
    user: process.env["DB_USER "],
    password: process.env["DB_PASSWORD "],
    host: process.env["DB_HOST "],
    port: process.env["DB_PORT "],
    database: process.env["DB_NAME "],
})

pool.connect((err) => {
    if(err){
        console.error("Database connection failed !!!", err);
    }
    else {
        console.log("Database connected!");
    }
});

module.exports = pool;