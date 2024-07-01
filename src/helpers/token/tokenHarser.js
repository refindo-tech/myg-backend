const crypto = require('crypto');

function parseToken(token) {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        throw new Error('Invalid token');
    }
    const payload = Buffer.from(tokenParts[1], 'base64').toString();
    return JSON.parse(payload);
}

function createToken(payload, secret) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = crypto.createHmac('sha256', secret).update(`${header}.${payloadString}`).digest('base64');
    return `${header}.${payloadString}.${signature}`;
}

module.exports = {
    parseToken,
    createToken
};