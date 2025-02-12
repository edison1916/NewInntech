const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  // Verifica que el token esté presente y tenga el formato correcto
  // utilizar la Bearer cuando envies el token desde postman
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Acceso denegado. Token no proporcionado o formato incorrecto.' });
  }

  // Verifica el token usando jwt.verify
  jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
    req.user = user; 
    next();
  });
};

module.exports = authenticateToken;
