const jwt = require('jsonwebtoken');
const { secret } = require('../config');

//export const verifyAccess = async (req, res, next) => 
module.exports = async function (req, resp, next) {
  // if (req.method === 'OPTIONS') {
  //   next();
  // }
  const accessToken = req.headers.authorization.split(' ')[1]

  if (!accessToken) {
    return resp.status(403).json({ message: 'No access token' })
  }

  try {
    const decoded = jwt.verify(accessToken, secret);
    console.log('*Decoded access token', decoded)

    if (!decoded) {
      return resp.status(403).json({ message: 'Invalid access token' })
    }

    req.user = decoded
    next()
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return resp.status(401).json({ message: 'Access token has been expired' })
    }

    console.log('VerifyAccess middleware')
    next(e)
  }
}