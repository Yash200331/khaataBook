const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const indexRouter = require('./routes/index-router')
const db = require('./config/mongoose-connection')

app.use('/', indexRouter);

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});