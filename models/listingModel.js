'use strict';
const pool = require('../database');
const {httpError} = require('../utils/errors');
const promisePool = pool.promise();

const getAllListings = async (next) => {
    try {
        const [rows] = await promisePool.execute(`SELECT listausId, otsikko, tyyppi, kuva, aika, kuvaus, Listaus.kayttajaId, Profiili.nimimerkki
                                                FROM Listaus
                                                JOIN Profiili 
                                                ON Profiili.kayttajaId = Listaus.kayttajaId`);
        return rows;
      } catch (e) {
        console.error('getAllCats', e.message);
        next(httpError('Database error', 500));
      }
}

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

const getListingByUserId = async (userId, next) => {
    try {
        const [rows] = await promisePool.execute(`SELECT listausId, otsikko, tyyppi, kuva, aika, kuvaus, kayttajaId 
                                                FROM Listaus WHERE kayttajaId = "${userId}"`);
        return rows;
    } catch (e) {
        console.error('getListing', e.message);
        next(httpError('Database error', 500));
    }
}

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
    getListingByUserId,
    getAllListings,
    addListing,
};
