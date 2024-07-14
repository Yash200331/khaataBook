const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const session = require('express-session'); // Add this line
const flash = require("connect-flash");


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret: 'process.env.JWT_KEY', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:2000 } // Set to true if using HTTPS
}));

const indexRouter = require('./routes/index-router')
const hisaabRouter = require('./routes/hisaab-router')
const db = require('./config/mongoose-connection')

app.use(flash());

app.use('/', indexRouter);
app.use('/hisaab', hisaabRouter);


app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});