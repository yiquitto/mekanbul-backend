var express = require('express');
var router = express.Router();

// Controller'ları çağır (Tekil klasör adına dikkat) [cite: 570]
var ctrlVenues = require('../controller/VenueController');
var ctrlComments = require('../controller/CommentController');

// --- Mekan Rotaları ---
router
    .route('/venues')
    .get(ctrlVenues.listVenues)
    .post(ctrlVenues.addVenue);

router
    .route('/venues/:venueid')
    .get(ctrlVenues.getVenue)
    .put(ctrlVenues.updateVenue)
    .delete(ctrlVenues.deleteVenue);

// --- Yorum Rotaları ---
router
    .route('/venues/:venueid/comments')
    .post(ctrlComments.addComment);

router
    .route('/venues/:venueid/comments/:commentid')
    .get(ctrlComments.getComment)
    .put(ctrlComments.updateComment)
    .delete(ctrlComments.deleteComment);

module.exports = router;