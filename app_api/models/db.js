var mongoose = require('mongoose');

// Bağlantı adresi .env dosyasından gelir [cite: 870]
var dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
    serverSelectionTimeoutMS: 5000 // 5 saniye içinde bağlanamazsa hata ver (sonsuza kadar dönmesin)
}).catch(err => console.log("Bağlantı Hatası:", err));
// Bağlantı olayları [cite: 83, 144]
mongoose.connection.on('connected', function () {
    console.log('Mongoose ' + dbURI + ' adresindeki veritabanına bağlandı\n');
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose bağlantı hatası\n: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose bağlantısı kesildi\n');
});

// Uygulama kapandığında bağlantıyı kapat [cite: 88, 144]
process.on('SIGINT', function () {
    mongoose.connection.close();
    console.log('Uygulama kapatıldığı için bağlantı kapatıldı\n');
    process.exit(0);
});

// Şema modelini yükle [cite: 138, 144]
require('./venue');