'use strict';
const express = require('express');
const port = process.env.PORT || 5000;

const db = require('./database');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const pug = require('pug');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views')

// middlewaret

app.use(express.json()); // lähetys json-muodossa

app.use(express.urlencoded()); // lähetyksen enkoodaus

app.use(express.static('pages')); // pages-kansio on staattinen

app.use(cookieParser());

app.use(flash());

app.use(sessions( {
    secret: 'asjklfnaghnqwuiojth851249',
    saveUninitialized: true,
    cookie: {maxAge: 9000000},
    resave: false
}));

const user = 'user@email.com';
const passwd = 'userpass';

let session;

app.get('/user', (req, res) => {
    session = req.session;
    if (session.userid) {
        res.send("Welcome user <a href=\'/logout'>click to logout</a>");
    }
    else {
        res.sendFile(__dirname + '/pages/login.html');
    }
});


app.post('/userPost', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sql = `SELECT salasana FROM Profiili WHERE email = "${email}"`;

    let passwordInput;

    db.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }
        let data = JSON.parse(JSON.stringify(result));
        passwordInput = data[0].salasana;   
    });

    if (toString(password) === toString(passwordInput)) {
        session = req.session;
        session.userid = req.body.email;
        console.log(req.session);
        res.send(`Tervetuloa, <a href=\'/myprofile'>siirry omaan profiiliin</a>`);
    } else {
        res.send('Invalid username or password');
    }
});

app.get('/logout',(req, res) => {
    req.session.destroy();
    res.redirect('/user');
})

app.get('/myprofile', (req, res) => {
 
    if (req.session.userid) {

        const email = req.session.userid;
        const sql = `SELECT * FROM Profiili WHERE email = "${email}"`;

        let username;

        db.query(sql, function (err, result) {
            if (err) {
                console.log(err);
            }
            let data = JSON.parse(JSON.stringify(result));
            console.log(data);
            username = data[0].nimimerkki;
            let email = data[0].email;
            let points = data[0].pisteet;
            res.render('myprofile.ejs', {nimimerkki: username, sposti: email, pisteet: points}); // ejs-näkymä
        });
      
    }
});

app.get('/form', (req, res) => {
    res.sendFile(__dirname + '/pages/register.html');
});

app.post('/formPost', (req, res) => {
    console.log(req.body); // haettava tieto on req.body:ssa

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const sql = `INSERT INTO Profiili (email, nimimerkki, salasana) VALUES ("${email}", "${username}", "${password}")` 

    db.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log('Taulu lisätty');
    });

    res.sendFile(__dirname + '/pages/index.html');
});

app.listen(port, ()=> {
    console.log(`Palvelin käynnissä osoitteessa http://localhost:${port}`);
});