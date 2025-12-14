var mongoose = require('mongoose');

// Saatler Şeması [cite: 196]
var hour = new mongoose.Schema({
    days: { type: String, required: true },
    open: String,
    close: String,
    isClosed: { type: Boolean, required: false }
});

// Yorumlar Şeması [cite: 196, 209]
var comment = new mongoose.Schema({
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Mekan Şeması [cite: 196, 209]
var venue = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    rating: { type: Number, min: 0, max: 5, default: 0 },
    coordinates: { type: [Number], index: '2dsphere' }, // [cite: 171]
    foodanddrink: [String],
    hours: [hour],
    comments: [comment]
});

mongoose.model('venue', venue, 'venues');