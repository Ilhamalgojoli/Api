const controller = require('../controller/auth');

const router = require('express').Router();

router.post('/sign-up', controller.sign_up);
router.post('/sign-in', controller.sign_in);

exports.module = router;