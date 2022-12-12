'use strict';
const pool = require('../database');
const {httpError} = require('../utils/errors');
const promisePool = pool.promise();

const getUser = async (userId, next) => {
    try {
        const [rows] = await promisePool.execute(`SELECT email, nimimerkki, salasana, profiilikuva, tutkinto, 
                                                pisteet, rooli, kayttajaId FROM Profiili WHERE kayttajaId = ?`, [userId]);
        return rows;
    } catch (e) {
        console.error('getUser', e.message);
        next(httpError('Database error', 500));
    }
};

const getUserByEmail = async (email, next) => {
    try {
        const [rows] = await promisePool.execute(`SELECT email, nimimerkki, salasana, profiilikuva, tutkinto, 
                                                pisteet, rooli, kayttajaId FROM Profiili WHERE email = ?`, [email]);
        return rows;
    } catch (e) {
        console.error('getUser', e.message);
        next(httpError('Database error', 500));
    }
};

const addUser = async (email, username, password, next) => {
    try {
        const [rows] = await promisePool.execute(`INSERT INTO Profiili (email, nimimerkki, salasana) 
                                                VALUES ("${email}", "${username}", "${password}")`);
        return rows;
    } catch (e) {
        console.error('getUser', e.message);
        next(httpError('Database error', 500));
    }
};

module.exports = {
    getUser,
    getUserByEmail,
    addUser,
};
