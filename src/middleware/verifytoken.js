const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    // Check token from cookies or Authorization header
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).send({
        message: 'No token provided.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).send({
        message: 'Invalid token.',
      });
    }

    req.userId = decoded.userId;
    req.role = decoded.role;

    next(); // call next() when token is valid

  } catch (error) {
    console.error('Error verifying token', error);
    res.status(401).send({
      message: 'Invalid token',
    });
  }
};

module.exports = verifyToken;
