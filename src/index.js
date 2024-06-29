const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();


const PORT = process.env.PORT || 3001;
const main = express();

main.use(cors());
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});