require('dotenv').config();

const express = require('express');
const app = express();

const port = 3000;

const router = require('./routes/route');

app.use(express.json());
app.use("/auth", router);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
