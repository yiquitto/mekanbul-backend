var express = require('express');
var router = express.Router();

// Controller'ları çağırıyoruz
// 'controllers' yerine 'controller' yazdık (Sonundaki s harfini sildik)
var ctrlVenues = require('../controller/VenueController');
var ctrlComments = require('../controller/CommentController');

// --- MEKAN ROTALARI ---
router
  .route('/venues')
  .get(ctrlVenues.listVenues)   // Mekanları Listele
  .post(ctrlVenues.addVenue);   // Mekan Ekle

router
  .route('/venues/:venueid')
  .get(ctrlVenues.getVenue)     // Tek Mekan Getir
  .put(ctrlVenues.updateVenue)  // Mekan Güncelle
  .delete(ctrlVenues.deleteVenue); // Mekan Sil

// --- YORUM ROTALARI ---
router
  .route('/venues/:venueid/comments')
  .post(ctrlComments.addComment); // Yorum Ekle

router
  .route('/venues/:venueid/comments/:commentid')
  .get(ctrlComments.getComment)    // Yorum Getir
  .put(ctrlComments.updateComment) // Yorum Güncelle
  .delete(ctrlComments.deleteComment); // Yorum Sil

module.exports = router;