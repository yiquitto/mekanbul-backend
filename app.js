var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Veritabanı bağlantısı (En üstte olmalı!)
require('./app_api/models/db');

// Rotaları çağır
var apiRouter = require('./app_api/routes/index');

var app = express();

// View engine setup (Backend projesi olduğu için şart değil ama kalsın)
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Rotasını Kullan (/api)
app.use('/api', apiRouter);

// Ana sayfa için basit mesaj (Hata vermesin diye)
app.get('/', function(req, res) {
    res.send('MekanBul Backend Çalışıyor! /api/venues adresini kullanın.');
});

// 404 Hatası yakalama
app.use(function(req, res, next) {
  next(createError(404));
});

// Hata işleyici
app.use(function(err, req, res, next) {
  // Sadece development ortamında hatayı göster
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Hata sayfasını render et (veya JSON dön)
  res.status(err.status || 500);
  res.json({"error": err.message});
});

module.exports = app;