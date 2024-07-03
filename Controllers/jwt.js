// Controllers/jwt.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: 'Token manquant' });
  }

  jwt.verify(token, 'Michard', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalide' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = [verifyToken ];
