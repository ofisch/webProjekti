'use strict';
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '10.114.34.50',
    user: 'onni',
    password: 'onniruutti',
    database: 'appDb',
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Yhteys tietokantaan muodostettu');
})

module.exports = connection;