const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const main = express();

// Konfigurasi CORS
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000','http://127.0.0.1:3001'],
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
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
const testimoniRoutes = require('./route/myBeauticaRoute/testimoniRoute');

//auth routes
const authRoutes = require('./route/authentication/authRoute');
const userRoutes = require('./route/authentication/userRoute');

//detail profile routes
const detailPembelianRoutes = require('./route/detailProfile/purchaseRoute');
const detailAcaraRoutes = require('./route/detailProfile/eventRoute');

//myacademy routes
const materiRoutes = require('./route/myAcademyRoute/materialsRoute');

//mya routes
const myaRoutes = '/myg/api/mya';
const productRoutes = require('./route/myaRoute/productRoute');
const cartRoutes = require('./route/myaRoute/cartRoute');
const cartItemRoutes = require('./route/myaRoute/cartItemRoute');
const orderRoutes = require('./route/myaRoute/orderRoute');

//mybeautica routes
const layananRoutes = require('./route/myBeauticaRoute/layananRoutes');

const corstOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}
main.use(cors(corstOptions));
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));
main.use(cookieParser());


//use global routes
main.use('/myg/api/', testimoniRoutes);

//use auth routes
main.use('/myg/auth', authRoutes);
main.use('/myg/api/', userRoutes);

//use detail profile routes
main.use('/myg/api/detail-profile', detailPembelianRoutes);
main.use('/myg/api/detail-profile', detailAcaraRoutes);


//use myacademy routes
main.use('/myg/api/materi', materiRoutes);

//use mya routes
main.use(myaRoutes + '/produk', productRoutes);
main.use(myaRoutes + '/keranjang', cartRoutes);
main.use(myaRoutes + '/keranjang', cartItemRoutes);
main.use(myaRoutes + '/order', orderRoutes);

//use mybeautica routes
main.use('/myg/api/layanan', layananRoutes);


main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});