'use strict';
const express = require('express');
const port = process.env.PORT || 3000;

const db = require('./database');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const multer = require('multer');
const path = require('path');
const userModel = require('./models/userModel');
const listingModel = require('./models/listingModel');
const { httpError } = require('./utils/errors');
const { json } = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        //console.log(file);
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage });



// middlewaret

app.use('/uploads', express.static('uploads'));

//app.use(multer);

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

app.get('/feed', (req, res) => {
    let username;



    listingModel.getAllListings()
    .then(function (result) {    
        let data = JSON.parse(JSON.stringify(result));   
        for (let i = 0; i < data.length; i++) {
            //console.log(data[i]);       
        }
      
        res.render('feed', {data});
        //res.sendFile(__dirname + '/pages/index.html', {data});
    }) 
});

app.get('/user', (req, res) => {
    session = req.session;
    if (session.userid) {
        res.render('feed');
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
                if (password === data[0].salasana) {
                    session = req.session;
                    session.userid = data[0].kayttajaId;               
                    res.redirect('feed');
                } else {
                    res.send('Sähköpostiosoite tai salasana on väärä');
                }
            }
        })
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/feed');
});

app.get('/myprofile', (req, res) => {
    if (req.session.userid) {

        //const email = req.session.userid;
        let username;
        let email;
        let points;
        let listingsToView = [];

        userModel.getUser(req.session.userid)
            .then(function (result) {
                if (result[0] === undefined) {
                    res.sendFile(__dirname + '/pages/myprofile.html');
                } else {
                    let data = JSON.parse(JSON.stringify(result));
                    console.log(data);
                    username = data[0].nimimerkki;
                    email = data[0].email;
                    points = data[0].pisteet;

                    listingModel.getListingByUserId(req.session.userid)
                    .then(function (result) {
                        if (result[0] === undefined) {
                            console.log('undefined');
                        } else {
                            let listings = JSON.parse(JSON.stringify(result));   
                            console.log(listings);
                            for (let i = 0; i < listings.length; i++) {
                                //console.log(data[i]);   
                                listingsToView[i] = listings[i];
                            }
                        }
                    })

                    res.render('myprofile.ejs', { nimimerkki: username, sposti: email, pisteet: points, listings: listingsToView}); // ejs-näkymä
                }
            })       
            
    } else {
        res.sendFile(__dirname + '/pages/login.html');
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
    if (req.session.userid) {
        res.render('newListing');
    } else {
        res.sendFile(__dirname + '/pages/login.html');
    }
})

app.post('/newListingPost', upload.single('img'), (req, res) => {
   
    if (req.session.userid) {  
  
    const title = req.body.title;
    const desc = req.body.description;
    const type = req.body.postType;
    //const img = "uploads/" + req.body.img;
    //console.log(req.body.img);
    let img = "uploads/" + req.file.filename;
    console.log(img);
    const time = "2022-12-12 13:00:00";
    const userId = req.session.userid

    console.log(title);
    console.log(desc);
    console.log(type);
    //console.log(img);
    console.log(time);
    console.log(userId);

    listingModel.addListing(title, type, img, time, desc, userId)
    .then(function (result) {
        //res.sendFile(__dirname + '/pages/index.html');
        res.redirect('/feed');
    });
} else {
    res.redirect('/user');
}
});

app.listen(port, () => {
    console.log(`Palvelin käynnissä osoitteessa http://localhost:${port}`);
});