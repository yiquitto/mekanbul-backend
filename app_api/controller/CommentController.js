var mongoose = require('mongoose');
var Venue = mongoose.model('venue');

var createResponse = function (res, status, content) {
    res.status(status).json(content);
};

// Yorum Ekle
var addComment = async function (req, res) {
    try {
        const venue = await Venue.findById(req.params.venueid).select('comments');
        if (venue) {
            venue.comments.push({
                author: req.body.author,
                rating: req.body.rating,
                text: req.body.text
            });
            const updatedVenue = await venue.save();
            // Son eklenen yorumu döndür
            const thisComment = updatedVenue.comments[updatedVenue.comments.length - 1];
            createResponse(res, 201, thisComment);
        } else {
            createResponse(res, 404, { "status": "Mekan bulunamadı" });
        }
    } catch (err) {
        createResponse(res, 400, err);
    }
};

// Yorum Getir
var getComment = async function (req, res) {
    try {
        const venue = await Venue.findById(req.params.venueid)
            .select('name comments')
            .exec();

        if (!venue) {
            return createResponse(res, 404, { "status": "Mekan bulunamadı" });
        }

        const comment = venue.comments.id(req.params.commentid);
        if (!comment) {
            return createResponse(res, 404, { "status": "Yorum bulunamadı" });
        }

        createResponse(res, 200, {
            venue: { name: venue.name, id: req.params.venueid },
            comment: comment
        });

    } catch (err) {
        createResponse(res, 404, err);
    }
};

// Yorum Güncelle
var updateComment = async function (req, res) {
    try {
        const venue = await Venue.findById(req.params.venueid).select('comments');
        if (!venue) {
            return createResponse(res, 404, { "status": "Mekan bulunamadı" });
        }
        
        const comment = venue.comments.id(req.params.commentid);
        if (!comment) {
            return createResponse(res, 404, { "status": "Yorum bulunamadı" });
        }

        if (req.body.author) comment.author = req.body.author;
        if (req.body.rating) comment.rating = req.body.rating;
        if (req.body.text) comment.text = req.body.text;

        await venue.save();
        createResponse(res, 200, comment);

    } catch (err) {
        createResponse(res, 400, err);
    }
};

// Yorum Sil
var deleteComment = async function (req, res) {
    try {
        const venue = await Venue.findById(req.params.venueid).select('comments');
        if (!venue) {
            return createResponse(res, 404, { "status": "Mekan bulunamadı" });
        }

        const comment = venue.comments.id(req.params.commentid);
        if (!comment) {
            return createResponse(res, 404, { "status": "Yorum bulunamadı" });
        }

        // Mongoose alt döküman silme yöntemi
        comment.deleteOne(); 
        await venue.save();
        createResponse(res, 200, { "status": "Yorum silindi" });

    } catch (err) {
        createResponse(res, 400, err);
    }
};

module.exports = {
    addComment,
    getComment,
    updateComment,
    deleteComment
};