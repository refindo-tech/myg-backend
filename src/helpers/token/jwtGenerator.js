const jsonwebtoken = require('jsonwebtoken');

function generateToken(payload, secret) {
    return jsonwebtoken.sign(payload, secret);
}

module.exports = { generateToken };