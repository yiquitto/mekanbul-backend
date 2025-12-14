require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Veritabanı bağlantısını projeye dahil et [cite: 584]
require('./app_api/models/db');

// Rota dosyasını çağır
var apiRouter = require('./app_api/routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API rotalarını kullan (/api) [cite: 533]
app.use('/api', apiRouter);

module.exports = app;