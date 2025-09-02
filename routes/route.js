const controller = require('../controller/controller');

const route = require('express').Router();


// Rute buat endpoint
route.post('/auth/sign-up', controller.sign_up);
route.post('/auth/sign-in', controller.sign_in);
route.post('/my-collection', controller.addCollection);
route.get("/", (req, res) => {
    res.send("Test!,Hallo!");
});

module.exports = route ;