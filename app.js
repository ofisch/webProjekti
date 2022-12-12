'use strict';
const express = require('express');
const port = process.env.PORT || 5000;

const db = require('./database');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const multer = require('multer');
const userModel = require('./models/userModel');
const listingModel = require('./models/listingModel');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}--${file.originalname}`);
    }
})
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10000000}
});

// middlewaret

app.use('/uploads', express.static('uploads'));

app.use(express.json()); // lähetys json-muodossa

app.use(express.urlencoded()); // lähetyksen enkoodaus

app.use(express.static('pages')); // pages-kansio on staattinen

app.use(cookieParser());

app.use(flash());

app.use(sessions({
    secret: 'asjklfnaghnqwuiojth851249',
    saveUninitialized: true,
    cookie: { maxAge: 9000000 },
    resave: false
}));

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
    let data;

    userModel.getUserByEmail(email)
        .then(function (result) {
            if (result[0] === undefined) {
                res.send('Sähköpostiosoite tai salasana on väärä');
            } else {
                data = JSON.parse(JSON.stringify(result));
                if (toString(password) === toString(data[0].salasana)) {
                    session = req.session;
                    session.userid = data[0].kayttajaId;               
                    res.send(`Tervetuloa, <a href=\'/myprofile'>siirry omaan profiiliin</a>`);
                } else {
                    res.send('Sähköpostiosoite tai salasana on väärä');
                }
            }
        })
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/user');
});

app.get('/myprofile', (req, res) => {
    if (req.session.userid) {

        //const email = req.session.userid;
        let username;

        userModel.getUser(req.session.userid)
            .then(function (result) {
                if (result[0] === undefined) {
                    res.sendFile(__dirname + '/pages/myprofile.html');
                } else {
                    let data = JSON.parse(JSON.stringify(result));
                    username = data[0].nimimerkki;
                    let email = data[0].email;
                    let points = data[0].pisteet;
                    res.render('myprofile.ejs', { nimimerkki: username, sposti: email, pisteet: points }); // ejs-näkymä
                }
            })

    }
});

app.get('/form', (req, res) => {
    res.sendFile(__dirname + '/pages/register.html');
});

app.post('/formPost', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    userModel.getUser(email)
        .then(function (result) {
            if (result[0] === undefined) {
                userModel.addUser(email, username, password)
                    .then(function (result) {
                        res.sendFile(__dirname + '/pages/index.html');
                    })
            } else {
                res.send(`Sähköpostiosoitteelle ${email} on jo olemassa tili`);
            }
        })
});

app.get('/newListing', (req, res) => {
    res.sendFile(__dirname + '/pages/additem.html');
})

app.post('/newListingPost', upload.single('img'), (req, res) => {
    if (req.session.userid) {

  
    const title = req.body.title;
    const desc = req.body.description;
    const type = req.body.postType;
    const img = "./uploads/" + req.body.img;
    const time = "2022-12-12 13:00:00";
    const userId = req.session.userid

    console.log(title);
    console.log(desc);
    console.log(type);
    console.log(img);
    console.log(time);
    console.log(userId);

    listingModel.addListing(title, type, img, time, desc, userId)
    .then(function (result) {
        res.sendFile(__dirname + '/pages/index.html');
    });
} else {
    res.redirect('/user');
}
});

app.listen(port, () => {
    console.log(`Palvelin käynnissä osoitteessa http://localhost:${port}`);
});