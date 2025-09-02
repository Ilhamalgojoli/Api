const controller = require('../controller/controller');

const route = require('express').Router();


// Rute buat endpoint
route.post('/sign-up', controller.sign_up);
route.post('/sign-in', controller.sign_in);
route.get("/", (req, res) => {
    res.send("Test!,Hallo!");
});

module.exports = route ;