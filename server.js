require('dotenv').config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const port = 4000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const router = require('./routes/route');

app.use(cookieParser());
app.use(express.json());
app.use("/", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
