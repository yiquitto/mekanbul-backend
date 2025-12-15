var express = require('express');
var router = express.Router();
// express router nesnesini başlattık

// controller dosyalarını buraya dahil ediyoruz
// dosya isimlendirmesine dikkat, controller klasöründen alıyoruz
var ctrlVenues = require('../api_controllers/VenueController');
var ctrlComments = require('../api_controllers/CommentController');

// --- mekanlarla ilgili rotalar ---
router
  .route('/venues')
  .get(ctrlVenues.listVenues)   // mekanları listeleme isteği
  // get isteği gelince listeleme fonksiyonu çalışacak
  .post(ctrlVenues.addVenue);   // yeni mekan ekleme isteği
  // post ile yeni mekan ekliyoruz

router
  .route('/venues/:venueid')
  // id parametresi gelirse burası çalışıyor
  .get(ctrlVenues.getVenue)     // tek bir mekanı getir
  .put(ctrlVenues.updateVenue)  // mekanı güncelle
  .delete(ctrlVenues.deleteVenue); // mekanı sil

// --- yorumlarla ilgili rotalar ---
router
  .route('/venues/:venueid/comments')
  .post(ctrlComments.addComment); // yorum ekleme
  // yorum mekana bağlı olduğu için mekan id'si gerekiyor

router
  .route('/venues/:venueid/comments/:commentid')
  // spesifik yorum işlemleri için hem mekan hem yorum id'si lazım
  .get(ctrlComments.getComment)    // yorumu getir
  .put(ctrlComments.updateComment) // yorumu güncelle
  .delete(ctrlComments.deleteComment); // yorumu sil

module.exports = router;
// app.js'de kullanmak için router'ı dışarı aktarıyoruz