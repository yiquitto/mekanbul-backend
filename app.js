var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// veritabanı bağlantısını en başta yapıyoruz, uygulama açılınca bağlansın
require('./app_api/models/db');

// api rotalarını tanımladığımız dosyayı buraya çağırdık
var apiRouter = require('./app_api/routes/index');

var app = express();

// backend projesi ama view engine ayarları kalsın, belki lazım olur
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
// konsolda gelen istekleri görmek için loglama
app.use(express.json());
// gelen json verilerini okuyabilmek için bu middleware şart
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// /api ile başlayan istekleri apiRouter'a yönlendiriyoruz
app.use('/api', apiRouter);

// ana sayfa boş kalmasın diye basit bir mesaj döndük
app.get('/', function(req, res) {
    res.send('MekanBul Backend Çalışıyor! /api/venues adresini kullanın.');
});

// eşleşen rota yoksa 404 hatası yakalıyoruz
app.use(function(req, res, next) {
  next(createError(404));
  // hata oluşturup bir sonraki adıma aktarıyoruz
});

// hata yakalama ve cevap dönme kısmı
app.use(function(err, req, res, next) {
  // geliştirme ortamındaysak hatayı detaylı göster
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // hata mesajını json olarak dönüyoruz
  res.status(err.status || 500);
  res.json({"error": err.message});
});

module.exports = app;