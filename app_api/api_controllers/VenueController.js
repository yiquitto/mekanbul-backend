var mongoose = require('mongoose');
var Venue = mongoose.model('venue');

// json cevap dönmek için yardımcı fonksiyon
var createResponse = function (res, status, content) {
    res.status(status).json(content);
};

// mesafe hesaplama fonksiyonları, dersten aldık
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

// 1. mekanları listeleme controller'ı
var listVenues = async function (req, res) {
    var lat = parseFloat(req.query.lat);
    var long = parseFloat(req.query.long);

    // enlem boylam gelmiş mi kontrol ediyoruz
    if (!lat || !long) {
        return createResponse(res, 404, { "status": "enlem ve boylam zorunludur" });
    }

    // dikkat: mongodb'de sıra önce boylam sonra enlem olmalı
    var point = {
        type: "Point",
        coordinates: [long, lat]
    };

    var geoOptions = {
        distanceField: "dis",
        spherical: true,
        maxDistance: converter.radian2Kilometer(100) // 100km
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
        // hata olursa mesajını dönüyoruz
        createResponse(res, 404, { "hata": e.message });
    }
};

// 2. mekan ekleme controller'ı
var addVenue = async function (req, res) {
    try {
        const venue = await Venue.create({
            ...req.body,
            // koordinatları float'a çevirip diziye atıyoruz
            coordinates: [
                parseFloat(req.body.long), 
                parseFloat(req.body.lat)
            ],
            foodanddrink: req.body.foodanddrink ? req.body.foodanddrink.split(",") : []
        });
        createResponse(res, 201, venue);
    } catch (error) {
        createResponse(res, 400, { "status": "Ekleme başarısız", "hata": error.message });
    }
};

// 3. tek mekan getirme controller'ı
var getVenue = async function (req, res) {
    try {
        const venue = await Venue.findById(req.params.venueid).exec();
        if (!venue) {
            createResponse(res, 404, { "status": "Mekan bulunamadı" });
            return;
        }
        createResponse(res, 200, venue);
    } catch (error) {
        createResponse(res, 404, { "status": "Mekan bulunamadı", "hata": error.message });
    }
};

// 4. mekan güncelleme controller'ı
var updateVenue = async function (req, res) {
    try {
        const updateData = { ...req.body };
        // koordinat değişirse formatı düzeltiyoruz
        if (req.body.lat && req.body.long) {
            updateData.coordinates = [parseFloat(req.body.long), parseFloat(req.body.lat)];
        }
        if (req.body.foodanddrink) {
            updateData.foodanddrink = req.body.foodanddrink.split(",");
        }

        const updatedVenue = await Venue.findByIdAndUpdate(
            req.params.venueid,
            updateData,
            { new: true }
        );
        
        if (!updatedVenue) {
             createResponse(res, 404, {"status": "Mekan bulunamadı"});
             return;
        }

        createResponse(res, 200, updatedVenue);
    } catch (error) {
        createResponse(res, 400, { "status": "Güncelleme hatası", "hata": error.message });
    }
};

// 5. mekan silme controller'ı
var deleteVenue = async function (req, res) {
    try {
        const venue = await Venue.findByIdAndDelete(req.params.venueid);
        if (venue) {
            createResponse(res, 200, { "status": "Mekan silindi" });
        } else {
            createResponse(res, 404, { "status": "Mekan bulunamadı" });
        }
    } catch (error) {
        createResponse(res, 404, { "status": "Silme hatası", "hata": error.message });
    }
};

module.exports = {
    listVenues,
    addVenue,
    getVenue,
    updateVenue,
    deleteVenue
};