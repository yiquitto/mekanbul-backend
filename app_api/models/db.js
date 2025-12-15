var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/mekanbul';

if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGODB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose ' + dbURI + ' adresine bağlandı');
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose bağlantı hatası: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose bağlantısı kesildi');
});

require('./venue');