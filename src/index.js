const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
require("dotenv").config();

//auth routes
const authRoutes = require('./route/authentication/userRoute');


const PORT = process.env.PORT || 3001;
const main = express();

main.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto'
    }
}));

main.use(cors());
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));

//use auth routes
main.use('myg/auth', authRoutes);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});