const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (roles) {
  return function (req, resp, next) {
    if (req.method === 'OPTIONS') {
      next();
    }
  
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return resp.status(403).json({message: 'User is not logged in'});
      }
  
      const {roles: userRoles} = jwt.verify(token, secret);
     let hasRole = false;
      userRoles.forEach((role)=>{
         if (roles.includes(role)) {
          hasRole = true;
         }
      });

      if (!hasRole) {
        return resp.status(403).json({message: 'You do not have access'});
      }
      
      next();
    } catch(e) {
      console.error(e);
      return resp.status(403).json({message: 'User is not logged in'});
    }
  }
}