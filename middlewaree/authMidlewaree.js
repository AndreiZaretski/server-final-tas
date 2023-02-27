const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (req, resp, next) {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return resp.status(403).json({messageLog: 'User is not logged in'});
    }

    const decodeData = jwt.verify(token, secret);
    req.user = decodeData;
  
    next();
  } catch(e) {
    if (e.name === 'TokenExpiredError') {
      return resp.status(401).json({ messageLog: 'Refresh token has been expired' })
    }
    console.error(e);
    return resp.status(403).json({messageLog: 'User is not logged in'});
  }
}