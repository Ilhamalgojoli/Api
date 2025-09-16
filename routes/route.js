const controller = require('../controller/controller');

const route = require('express').Router();

// Rute buat endpoint
route.post('/auth/sign-up', controller.sign_up);
route.post('/auth/sign-in', controller.sign_in);
route.get('/logout', controller.logout);
route.post('/my-collection', controller.addCollection);
route.get('/get-collection', controller.getCollection);
route.get('/auth/check', controller.getToken);
route.get("/", (req, res) => {
    res.send("Test!,Hallo!");
});

module.exports = route ;