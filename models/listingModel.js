'use strict';
const pool = require('../database');
const {httpError} = require('../utils/errors');
const promisePool = pool.promise();

const getListing = async (listingId, next) => {
    try {
        const [rows] = await promisePool.execute(`SELECT listausId, otsikko, tyyppi, kuva, aika, kuvaus, kayttajaId 
                                                FROM Listaus WHERE listausId = "${listingId}"`);
        return rows;
    } catch (e) {
        console.error('getListing', e.message);
        next(httpError('Database error', 500));
    }
};

const addListing = async (title, type, img, time, desc, userId, next) => {
    try {
        const [rows] = await promisePool.execute(`INSERT INTO Listaus (otsikko, tyyppi, kuva, aika, kuvaus, kayttajaId) 
                                                VALUES ("${title}", "${type}", "${img}", "${time}", "${desc}", ${userId})`);
        return rows;
    } catch (e) {
        console.error('addListing', e.message);
        next(httpError('Database error', 500));
    }
};

module.exports = {
    getListing,
    addListing,
};
