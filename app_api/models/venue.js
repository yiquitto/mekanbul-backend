var mongoose = require('mongoose');

// Saat Şeması
var hourSchema = new mongoose.Schema({
    days: { type: String, required: true },
    open: String,
    close: String,
    isClosed: { type: Boolean, required: true }
});

// Yorum Şeması
var commentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Mekan Şeması
var venueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    foodanddrink: [String],
    // DİKKAT: Koordinatlar [Boylam, Enlem] sırasıyla saklanır
    coordinates: { type: [Number], index: '2dsphere' },
    hours: [hourSchema],
    comments: [commentSchema]
});

mongoose.model('venue', venueSchema);