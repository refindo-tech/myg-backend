const jwt = require('jsonwebtoken');
const webResponses = require('../helpers/web/webResponses');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json(webResponses.errorResponse('Access denied. No token provided.'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json(webResponses.errorResponse('Invalid token.'));
    }
};

module.exports = authMiddleware;
