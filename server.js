require('dotenv').config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const port = 3000;

const router = require('./routes/route');

app.use(cookieParser());
app.use(express.json());
app.use("/", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
