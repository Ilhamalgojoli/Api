require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

async function checkConnection(){
    try{
        const client = await pool.connect();
        const resultTest = await client.query('SELECT * FROM users');
        console.log("Success to connect database", resultTest);
        client.release();


    } catch (err){
        console.error("Error to connect database", err)
    }
}

checkConnection();

module.exports = pool;