var mongoose = require('mongoose');
var Venue = mongoose.model('venue');

var createResponse = function (res, status, content) {
    res.status(status).json(content);
};

// Son Puanı Hesapla (Manuel Döngü ile) 
var calculateLastRating = function (incomingVenue, isDeleted) {
    var i, numComments, avgRating, sumRating = 0;
    
    if (incomingVenue.comments && incomingVenue.comments.length > 0) {
        numComments = incomingVenue.comments.length;
        if (isDeleted && numComments === 0) {
            avgRating = 0;
        } else {
            for (i = 0; i < numComments; i++) {
                sumRating = sumRating + incomingVenue.comments[i].rating;
            }
            avgRating = Math.ceil(sumRating / numComments);
        }
        incomingVenue.rating = avgRating;
        incomingVenue.save();
    }
};

// Puanı Güncelle [cite: 769]
var updateRating = function (venueid, isDeleted) {
    Venue.findById(venueid)
        .select('rating comments')
        .exec()
        .then(function (venue) {
            if (venue) {
                calculateLastRating(venue, isDeleted);
            }
        });
};

// Yorum Ekle [cite: 774, 779]
var addComment = async function (req, res) {
    try {
        const venue = await Venue.findById(req.params.venueid).select('comments');
        if (!venue) {
            createResponse(res, 404, { "status": "Mekan bulunamadı" });
            return;
        }
        
        venue.comments.push(req.body);
        const savedVenue = await venue.save();
        updateRating(savedVenue._id, false);
        
        const thisComment = savedVenue.comments[savedVenue.comments.length - 1];
        createResponse(res, 201, thisComment);

    } catch (error) {
        createResponse(res, 400, { "status": "Yorum ekleme başarısız" });
    }
};

// Yorum Getir [cite: 676]
var getComment = async function (req, res) {
    try {
        const venue = await Venue.findById(req.params.venueid).select('name comments');
        if (!venue) {
            createResponse(res, 404, { "status": "Mekan bulunamadı" });
            return;
        }
        
        const comment = venue.comments.id(req.params.commentid);
        if (!comment) {
            createResponse(res, 404, { "status": "Yorum bulunamadı" });
            return;
        }
        
        const response = {
            venue: { name: venue.name, id: req.params.venueid },
            comment: comment
        };
        createResponse(res, 200, response);

    } catch (error) {
        createResponse(res, 404, { "status": "Hata oluştu" });
    }
};

// Yorum Güncelle [cite: 819]
var updateComment = async function (req, res) {
    try {
        const venue = await Venue.findById(req.params.venueid).select('comments');
        if (!venue) {
            createResponse(res, 404, { "status": "Mekan bulunamadı" });
            return;
        }
        
        const comment = venue.comments.id(req.params.commentid);
        if (!comment) {
            createResponse(res, 404, { "status": "Yorum bulunamadı" });
            return;
        }
        
        comment.set(req.body);
        await venue.save();
        updateRating(venue._id, false);
        createResponse(res, 200, comment);

    } catch (error) {
        createResponse(res, 400, { "status": "Güncelleme başarısız" });
    }
};

// Yorum Sil [cite: 860]
var deleteComment = async function (req, res) {
    try {
        const venue = await Venue.findById(req.params.venueid).select('comments');
        if (!venue) {
            createResponse(res, 404, { "status": "Mekan bulunamadı" });
            return;
        }
        
        const comment = venue.comments.id(req.params.commentid);
        if (!comment) {
            createResponse(res, 404, { "status": "Yorum bulunamadı" });
            return;
        }
        
        comment.deleteOne();
        await venue.save();
        updateRating(venue._id, true);
        createResponse(res, 200, { "status": "Yorum silindi" });

    } catch (error) {
        createResponse(res, 400, { "status": "Silme başarısız" });
    }
};

module.exports = {
    addComment,
    getComment,
    updateComment,
    deleteComment
};