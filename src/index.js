const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const path = require('path');

const PORT = process.env.PORT || 3001;
const main = express();

// Konfigurasi CORS
const corsOptions = {
    origin: ['http://92.112.192.81:3000', 'http://127.0.0.1:3000','http://localhost:3001', 'http://127.0.0.1:3001', 'https://myg.app'],
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
main.use(cors(corsOptions));

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
main.use(cookieParser());

// Middleware untuk menangani unggahan file
main.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware logging untuk permintaan ke rute statis (opsional, untuk debugging)
main.use('/uploads', (req, res, next) => {
    console.log(`Request to static file: ${req.path}`);
    next();
});


main.use(cors(corsOptions));

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));
main.use(cookieParser());

// Middleware untuk menangani unggahan file
main.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware logging untuk permintaan ke rute statis (opsional, untuk debugging)
main.use('/uploads', (req, res, next) => {
    console.log(`Request to static file: ${req.path}`);
    next();
});

// global route
const testimoniRoutes = require('./route/testimoniRoute/testimoniRoute');

//auth routes
const authRoutes = require('./route/authentication/authRoute');
const userRoutes = require('./route/authentication/userRoute');

//detail profile routes
const detailPembelianRoutes = require('./route/detailProfile/purchaseRoute');
const testimoniAcademyRoutes = require('./route/myAcademyRoute/testimoniAcademyRoutes');
const detailAcaraRoutes = require('./route/detailProfile/eventRoute');

//myacademy routes
const materiRoutes = require('./route/myAcademyRoute/materialsRoute');
const trainingRoutes = require('./route/myAcademyRoute/trainingRoutes')
const examRoutes = require('./route/myAcademyRoute/examRoutes')

//mya routes
const myaRoutes = '/myg/api/mya';
const productRoutes = require('./route/myaRoute/productRoute');
const cartRoutes = require('./route/myaRoute/cartRoute');
const cartItemRoutes = require('./route/myaRoute/cartItemRoute');
const orderRoutes = require('./route/myaRoute/orderRoute');

//mybeautica routes
const layananRoutes = require('./route/myBeauticaRoute/layananRoutes');

//admin route
const adminRoutes = require('./route/authentication/adminRoute');

// Gunakan global routes
main.use('/myg/api/', testimoniRoutes);

// Gunakan auth routes
main.use('/myg/auth', authRoutes);
main.use('/myg/api/', userRoutes);

// Gunakan detail profile routes
main.use('/myg/api/detail-profile', detailPembelianRoutes);
main.use('/myg/api/detail-profile', detailAcaraRoutes);

// Gunakan myacademy routes
main.use('/myg/api/materi', materiRoutes);
main.use('/myg/api/training', trainingRoutes);
main.use('/myg/api/exam', examRoutes);
main.use('/myg/api/academy', testimoniAcademyRoutes)

// Gunakan mya routes
main.use(myaRoutes + '/produk', productRoutes);
main.use(myaRoutes + '/keranjang', cartRoutes);
main.use(myaRoutes + '/keranjang', cartItemRoutes);
main.use(myaRoutes + '/order', orderRoutes);

// Gunakan mybeautica routes
main.use('/myg/api/layanan', layananRoutes);

// Gunakan Admin Route
main.use('/admin/adminPage', adminRoutes);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});
