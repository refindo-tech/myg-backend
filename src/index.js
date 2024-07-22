const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const fs = require('fs');

//auth routes
const userRoutes = require('./route/authentication/userRoute');
const layananRoutes = require('./route/myBeauticaRoute/layananRoutes');
const testimoniRoutes = require('./route/myBeauticaRoute/testimoniRoute');
const materiRoutes = require('./route/myAcademyRoute/materialsRoute');


const PORT = process.env.PORT || 3001;
const main = express();

main.use(cors());
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));
main.use(cookieParser());

//use auth routes
main.use('/myg/api', userRoutes);
main.use('/myg/api/layanan', layananRoutes);
main.use('/myg/api/', testimoniRoutes);
main.use('/myg/api/materi', materiRoutes);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});