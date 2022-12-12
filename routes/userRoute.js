'use strict';
const express = require('express');
const {user_get} = require('../controllers/userController');
const router = express.Router();

router.route('/user').get(user_get);

module.exports = router;