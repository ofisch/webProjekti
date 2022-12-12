'use strict';
const {getUser} = require('../models/userModel');
const {validationResult} = require('express-validator');
const {httpError} = require('../utils/errors');

const user_get = async (req, res, next) => {
    try {
        const user = await getUser(req.params.email, next);
        if (user.length < 1) {
            next(httpError('No user found', 404));
            return;
        }
        res.json(user.pop());
    } catch (e) {
        console.error('user_get', e.message);
        next(httpError('Internal server error', 500));
    }
};

module.exports = {
    user_get,
}