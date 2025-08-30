const controller = require('../controller/auth');

const route = require('express').Router();

route.post('/sign-up', controller.sign_up);
route.post('/sign-in', controller.sign_in);
route.get("/", (req, res) => {
    res.send("Test!,Hallo!");
});

module.exports = route ;