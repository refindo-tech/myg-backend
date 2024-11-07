// middlewares/corsMiddleware.js
const corsMiddleware = (req, res, next) => {
    const allowedOrigins = ['http://92.112.192.81:3000', 'http://127.0.0.1:3000','http://localhost:3001', 'http://127.0.0.1:3001', 'https://myg.app'];
    const origin = req.headers.origin;
  
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    
    if (req.method === 'OPTIONS') {
      return res.status(200).send();
    }
    
    next();
  };
  
  module.exports = corsMiddleware;