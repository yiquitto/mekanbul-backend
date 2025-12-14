var mongoose = require('mongoose');
var Venue = mongoose.model('venue');

// Cevap oluşturucu yardımcı fonksiyon [cite: 593]
var createResponse = function (res, status, content) {
    res.status(status).json(content);
};

// Mesafe dönüştürücü (Hocanın özel kodu) 
var converter = (function () {
    var earthRadius = 6371; // km
    var radian2Kilometer = function (radian) {
        return parseFloat(radian * earthRadius);
    };
    var kilometer2Radian = function (distance) {
        return parseFloat(distance / earthRadius);
    };
    return {
        radian2Kilometer: radian2Kilometer,
        kilometer2Radian: kilometer2Radian
    };
})();

// Mekanları Listele (GeoSpatial) 
var listVenues = async function (req, res) {
    var lat = parseFloat(req.query.lat);
    var long = parseFloat(req.query.long);

    if (!lat || !long) {
        createResponse(res, 404, { "status": "lat ve long parametreleri zorunludur" });
        return;
    }

    var point = { type: "Point", coordinates: [lat, long] };
    var geoOptions = {
        distanceField: "dis",
        spherical: true,
        maxDistance: converter.radian2Kilometer(100) // 100km çapında
    };

    try {
        const result = await Venue.aggregate([
            {
                $geoNear: {
                    near: point,
                    ...geoOptions
                }
            }
        ]);

        const venues = result.map(function (venue) {
            return {
                distance: converter.kilometer2Radian(venue.dis),
                name: venue.name,
                address: venue.address,
                rating: venue.rating,
                foodanddrink: venue.foodanddrink,
                id: venue._id
            };
        });
        createResponse(res, 200, venues);

    } catch (e) {
        createResponse(res, 404, e);
    }
};

// Yeni Mekan Ekle [cite: 744]
var addVenue = async function (req, res) {
    try {
        const venue = await Venue.create({
            ...req.body,
            coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)],
            foodanddrink: req.body.foodanddrink ? req.body.foodanddrink.split(",") : []
        });
        createResponse(res, 201, venue);
    } catch (error) {
        createResponse(res, 400, error);
    }
};

// Tek Mekan Getir [cite: 650]
var getVenue = async function (req, res) {
    try {
        const venue = await Venue.findById(req.params.venueid).exec();
        if (!venue) {
            createResponse(res, 404, { "status": "Böyle bir mekan yok" });
            return;
        }
        createResponse(res, 200, venue);
    } catch (error) {
        createResponse(res, 404, { "status": "Böyle bir mekan yok" });
    }
};

// Mekan Güncelle [cite: 799]
var updateVenue = async function (req, res) {
    try {
        const updatedVenue = await Venue.findByIdAndUpdate(
            req.params.venueid,
            {
                ...req.body,
                coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)],
                foodanddrink: req.body.foodanddrink ? req.body.foodanddrink.split(",") : []
            },
            { new: true }
        );
        createResponse(res, 200, updatedVenue);
    } catch (error) {
        createResponse(res, 400, { "status": "Güncelleme başarısız", error });
    }
};

// Mekan Sil [cite: 837]
var deleteVenue = async function (req, res) {
    try {
        const venue = await Venue.findByIdAndDelete(req.params.venueid);
        if (venue) {
            createResponse(res, 200, { "status": "Mekan silindi" });
        } else {
            createResponse(res, 404, { "status": "Böyle bir mekan yok" });
        }
    } catch (error) {
        createResponse(res, 404, { "status": "Silme hatası" });
    }
};

module.exports = {
    listVenues,
    addVenue,
    getVenue,
    updateVenue,
    deleteVenue
};