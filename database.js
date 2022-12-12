'use strict';
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '10.114.34.50',
    user: 'onni',
    password: 'onniruutti',
    database: 'appDb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/*
pool.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Yhteys tietokantaan muodostettu');
})
*/
module.exports = pool;